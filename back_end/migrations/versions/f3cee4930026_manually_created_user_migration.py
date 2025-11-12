"""Manually created user migration

Revision ID: f3cee4930026
Revises: b5931d3ef240
Create Date: 2025-11-12 05:10:11.963678

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f3cee4930026'
down_revision: Union[str, Sequence[str], None] = 'b5931d3ef240'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
