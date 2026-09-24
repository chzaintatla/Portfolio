"""Local PostgreSQL for development, without a system install.

Uses the PostgreSQL 16 binaries bundled in the `pgserver` pip package (dev-only dependency):

    pip install pgserver
    python scripts/local_pg.py init    # create cluster in backend/.pgdata + sparkwave user/db
    python scripts/local_pg.py start
    python scripts/local_pg.py stop
    python scripts/local_pg.py status

Then set DATABASE_URL=postgresql+psycopg://sparkwave:<password>@localhost:5432/sparkwave in .env
and run `alembic upgrade head && python -m app.seed.seed`.
"""

import os
import subprocess
import sys
import tempfile
from pathlib import Path

import pgserver  # noqa: F401  (import locates the bundled binaries)

BIN = Path(pgserver.__file__).parent / "pginstall" / "bin"
DATA = Path(__file__).resolve().parents[1] / ".pgdata"
PORT = os.environ.get("PGPORT", "5432")
SUPER_PW = os.environ.get("PG_SUPERUSER_PASSWORD", "SparkWavePg2026")
APP_PW = os.environ.get("PG_APP_PASSWORD", "sparkwave-local-2026")


def run(exe: str, *args: str, **kw) -> subprocess.CompletedProcess:
    return subprocess.run([str(BIN / exe), *args], check=kw.pop("check", True), **kw)


def init() -> None:
    if DATA.exists():
        sys.exit(f"{DATA} already exists")
    with tempfile.NamedTemporaryFile("w", delete=False) as f:
        f.write(SUPER_PW)
    try:
        run("initdb", "-D", str(DATA), "-U", "postgres", f"--pwfile={f.name}", "--auth=scram-sha-256", "-E", "UTF8",
            "--locale=C")
    finally:
        os.unlink(f.name)
    start()
    env = {**os.environ, "PGPASSWORD": SUPER_PW}
    for sql in (f"CREATE ROLE sparkwave LOGIN PASSWORD '{APP_PW}';", "CREATE DATABASE sparkwave OWNER sparkwave;",
                "CREATE DATABASE sparkwave_test OWNER sparkwave;"):
        run("psql", "-h", "localhost", "-p", PORT, "-U", "postgres", "-c", sql, env=env)
    print(f"Ready: postgresql+psycopg://sparkwave:{APP_PW}@localhost:{PORT}/sparkwave")


def start() -> None:
    run("pg_ctl", "-D", str(DATA), "-l", str(DATA / "server.log"), "-o", f"-p {PORT}", "start")


def stop() -> None:
    run("pg_ctl", "-D", str(DATA), "stop")


def status() -> None:
    run("pg_ctl", "-D", str(DATA), "status", check=False)


if __name__ == "__main__":
    commands = {"init": init, "start": start, "stop": stop, "status": status}
    if len(sys.argv) != 2 or sys.argv[1] not in commands:
        sys.exit(f"usage: python scripts/local_pg.py [{'|'.join(commands)}]")
    commands[sys.argv[1]]()
