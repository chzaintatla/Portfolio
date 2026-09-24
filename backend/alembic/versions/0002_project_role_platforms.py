"""Add role and platforms to projects.

Revision ID: 0002_project_role_platforms
Revises: 0001_initial
Create Date: 2026-09-24
"""
import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision = "0002_project_role_platforms"
down_revision = "0001_initial"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    cols = {c["name"] for c in sa.inspect(bind).get_columns("projects")}
    json_type = postgresql.JSONB() if bind.dialect.name == "postgresql" else sa.JSON()
    # 0001 builds tables from current models, so fresh databases already have these columns.
    if "role" not in cols:
        op.add_column("projects", sa.Column("role", sa.String(120), nullable=True))
    if "platforms" not in cols:
        op.add_column("projects", sa.Column("platforms", json_type, nullable=True))


def downgrade() -> None:
    op.drop_column("projects", "platforms")
    op.drop_column("projects", "role")
