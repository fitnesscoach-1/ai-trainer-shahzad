"""add_user_role

Revision ID: 736d23b4c2bf
Revises: 1350a1eb72bd
Create Date: 2025-12-28 00:42:13.118283
"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '736d23b4c2bf'
down_revision: Union[str, Sequence[str], None] = '1350a1eb72bd'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """
    Add role column to users table.
    Default role is 'user' for all existing and new users.
    """
    op.add_column(
        'users',
        sa.Column(
            'role',
            sa.String(length=20),
            nullable=False,
            server_default='user'
        )
    )


def downgrade() -> None:
    """
    Remove role column from users table.
    """
    op.drop_column('users', 'role')
