"""Initial schema.

Builds every table from the SQLAlchemy models as they stand at v1.0. Later schema changes should be
generated normally with `alembic revision --autogenerate -m "..."` and reviewed before committing.

Revision ID: 0001_initial
Revises:
Create Date: 2026-09-24
"""
from alembic import op

import app.models  # noqa: F401
from app.db.base import Base

revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    Base.metadata.create_all(op.get_bind())


def downgrade() -> None:
    Base.metadata.drop_all(op.get_bind())
