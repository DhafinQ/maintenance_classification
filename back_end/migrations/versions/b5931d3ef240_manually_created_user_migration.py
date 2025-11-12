"""Manually created user migration

Revision ID: b5931d3ef240
Revises: 2e750739da08
Create Date: 2025-11-12 05:09:15.070317

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b5931d3ef240'
down_revision: Union[str, Sequence[str], None] = '2e750739da08'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
