import os
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Integer, String, UniqueConstraint, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DB_PATH = os.environ.get("COMPLETIONS_DB_PATH", os.path.join(os.path.dirname(__file__), "completions.db"))

engine = create_engine(f"sqlite:///{DB_PATH}")
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()


class Completion(Base):
    __tablename__ = "completions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    client_id = Column(String, nullable=False)
    problem_number = Column(String, nullable=False)
    language = Column(String, nullable=False)
    completed_at = Column(DateTime, nullable=False)

    __table_args__ = (UniqueConstraint("client_id", "problem_number", "language", name="uq_completion"),)


class Flag(Base):
    __tablename__ = "flags"

    id = Column(Integer, primary_key=True, autoincrement=True)
    client_id = Column(String, nullable=False)
    problem_number = Column(String, nullable=False)
    language = Column(String, nullable=False)
    flagged_at = Column(DateTime, nullable=False)

    __table_args__ = (UniqueConstraint("client_id", "problem_number", "language", name="uq_flag"),)


Base.metadata.create_all(engine)


def record_completion(client_id, problem_number, language):
    if not client_id:
        return

    with SessionLocal() as session:
        already_completed = (
            session.query(Completion)
            .filter_by(client_id=client_id, problem_number=problem_number, language=language)
            .first()
        )

        if already_completed is None:
            session.add(
                Completion(
                    client_id=client_id,
                    problem_number=problem_number,
                    language=language,
                    completed_at=datetime.now(timezone.utc),
                )
            )
            session.commit()


def get_completions(client_id):
    with SessionLocal() as session:
        rows = session.query(Completion).filter_by(client_id=client_id).all()

        return [
            {
                "problem_number": row.problem_number,
                "language": row.language,
                "completed_at": row.completed_at.isoformat(),
            }
            for row in rows
        ]


def get_flags(client_id):
    if not client_id:
        return []

    with SessionLocal() as session:
        rows = session.query(Flag).filter_by(client_id=client_id).all()

        return [
            {
                "problem_number": row.problem_number,
                "language": row.language,
                "flagged_at": row.flagged_at.isoformat(),
            }
            for row in rows
        ]


def is_flagged(client_id, problem_number, language):
    if not client_id:
        return False

    with SessionLocal() as session:
        return (
            session.query(Flag)
            .filter_by(client_id=client_id, problem_number=problem_number, language=language)
            .first()
            is not None
        )


def toggle_flag(client_id, problem_number, language):
    if not client_id:
        return False

    with SessionLocal() as session:
        existing = (
            session.query(Flag)
            .filter_by(client_id=client_id, problem_number=problem_number, language=language)
            .first()
        )

        if existing is not None:
            session.delete(existing)
            session.commit()
            return False

        session.add(
            Flag(
                client_id=client_id,
                problem_number=problem_number,
                language=language,
                flagged_at=datetime.now(timezone.utc),
            )
        )
        session.commit()
        return True
