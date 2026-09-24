def test_public_content(client):
    assert len(client.get("/api/services").json()) >= 8
    assert len(client.get("/api/technologies").json()) >= 10
    assert len(client.get("/api/process").json()) == 6
    assert client.get("/api/projects/neurodesk-ai").status_code == 200
    assert client.get("/api/projects/does-not-exist").status_code == 404
    # Demo testimonials are seeded unpublished.
    assert client.get("/api/testimonials").json() == []


def test_admin_requires_auth(client):
    assert client.get("/api/admin/leads").status_code == 401
    assert client.post("/api/faqs", json={"question": "x", "answer": "y"}).status_code == 401


def test_csrf_enforced(admin):
    token = admin.headers.pop("X-CSRF-Token")
    assert admin.post("/api/faqs", json={"question": "Q?", "answer": "A."}).status_code == 403
    admin.headers["X-CSRF-Token"] = token


def test_crud_roundtrip(admin):
    r = admin.post("/api/faqs", json={"question": "New question?", "answer": "Answer.", "published": True})
    assert r.status_code == 201
    faq_id = r.json()["id"]
    assert admin.put(f"/api/faqs/{faq_id}", json={"published": False}).json()["published"] is False
    assert all(f["id"] != faq_id for f in admin.get("/api/faqs").json())
    assert admin.delete(f"/api/faqs/{faq_id}").status_code == 204


def test_project_html_is_sanitized(admin):
    r = admin.post("/api/projects", json={"title": "XSS Test", "challenge": "<p>ok</p><script>alert(1)</script>"})
    assert r.status_code == 201
    assert "<script>" not in r.json()["challenge"]
    assert r.json()["slug"] == "xss-test"


def test_lead_flow(client, admin):
    r = client.post("/api/leads", json={"name": "Jane Doe", "email": "jane@example.com",
                                        "message": "We need a booking platform.", "service": "Web Development"})
    assert r.status_code == 201
    leads = admin.get("/api/admin/leads").json()
    lead = next(item for item in leads["items"] if item["email"] == "jane@example.com")
    assert lead["status"] == "new"
    updated = admin.put(f"/api/admin/leads/{lead['id']}", json={"status": "qualified", "priority": "high"}).json()
    assert updated["status"] == "qualified"
    noted = admin.post(f"/api/admin/leads/{lead['id']}/notes", json={"body": "Called, wants a proposal."}).json()
    assert noted["notes"][0]["body"] == "Called, wants a proposal."


def test_honeypot_discards(client, admin):
    client.post("/api/leads", json={"name": "Bot", "email": "bot@example.com", "message": "spam spam spam",
                                    "website": "http://spam"})
    assert all(i["email"] != "bot@example.com" for i in admin.get("/api/admin/leads").json()["items"])


def test_invalid_reference_is_422_not_500(admin):
    r = admin.post("/api/blog", json={"title": "Bad FK", "content": "<p>x</p>", "category_id": 999999})
    assert r.status_code == 422


def test_scheduled_post_hidden_until_due(admin, client):
    from datetime import UTC, datetime, timedelta

    future = (datetime.now(UTC) + timedelta(days=1)).isoformat()
    r = admin.post("/api/blog", json={"title": "Tomorrow Post", "content": "<p>soon</p>", "status": "scheduled",
                                      "published_at": future})
    assert r.status_code == 201
    assert client.get(f"/api/blog/{r.json()['slug']}").status_code == 404
    assert any(d["posts"] for d in admin.get("/api/admin/blog/calendar").json())
    daily = client.get("/api/blog/daily").json()
    assert all(p["title"] != "Tomorrow Post" for d in daily for p in d["posts"])
