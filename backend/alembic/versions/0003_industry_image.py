"""Add image to industries.

Revision ID: 0003_industry_image
Revises: 0002_project_role_platforms
Create Date: 2026-09-24
"""
import sqlalchemy as sa
from alembic import op

revision = "0003_industry_image"
down_revision = "0002_project_role_platforms"
branch_labels = None
depends_on = None


def upgrade() -> None:
    cols = {c["name"] for c in sa.inspect(op.get_bind()).get_columns("industries")}
    if "image" not in cols:
        op.add_column("industries", sa.Column("image", sa.String(600), nullable=True))


def downgrade() -> None:
    op.drop_column("industries", "image")
