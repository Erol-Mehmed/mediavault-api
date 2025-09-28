from dataclasses import dataclass
from typing import Optional, Dict, Any


@dataclass
class Media:
    id: Optional[str]
    title: str
    type: str
    genre: str
    release_year: Optional[int] = None

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "title": self.title,
            "type": self.type,
            "genre": self.genre,
            "release_year": self.release_year,
        }
