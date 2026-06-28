import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

import database
from app import app as flask_app


@pytest.fixture
def app():
    yield flask_app


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def db():
    """Replace the module-level DB engine with an in-memory SQLite DB for tests."""
    test_engine = create_engine("sqlite:///:memory:")
    database.Base.metadata.create_all(test_engine)
    TestSession = sessionmaker(bind=test_engine)

    original_engine = database.engine
    original_session = database.SessionLocal
    database.engine = test_engine
    database.SessionLocal = TestSession

    yield

    database.engine = original_engine
    database.SessionLocal = original_session
