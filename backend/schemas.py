from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict
from datetime import datetime

# ======================================================
# 🔒 BASE CONFIG (Pydantic v2 + backward compatibility)
# ======================================================

class ORMBaseModel(BaseModel):
    class Config:
        from_attributes = True
        orm_mode = True  # backward compatibility (safe)

# ======================================================
# USER SCHEMAS
# ======================================================

class UserBase(ORMBaseModel):
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    username: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    zip_code: Optional[str] = None
    country: Optional[str] = None
    profile_image: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: int


class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    username: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    zip_code: Optional[str] = None
    country: Optional[str] = None
    profile_image: Optional[str] = None


class ChangePassword(BaseModel):
    old_password: str
    new_password: str
    confirm_password: str


class Token(BaseModel):
    access_token: str
    token_type: str

# ======================================================
# WORKOUT GENERATOR (INPUT)
# ======================================================

class WorkoutCreate(BaseModel):
    name: str
    age: int

    weight: int
    weight_unit: str

    height: int
    height_unit: str

    blood_group: str
    fitness_goal: str
    medical_condition: str
    workout_preference: str

# ======================================================
# WORKOUT RESPONSE (ORIGINAL – PRESERVED)
# ======================================================

class WorkoutResponse(ORMBaseModel):
    id: int
    user_id: int

    name: str
    age: int

    weight: int
    weight_unit: str

    height: int
    height_unit: str

    blood_group: str

    fitness_goal: str
    medical_condition: str
    workout_preference: str

    workout_plan: Optional[str]
    created_at: datetime

# ======================================================
# 🧠 WORKOUT HISTORY (STABLE CONTRACT)
# ======================================================

class WorkoutHistoryResponse(ORMBaseModel):
    id: int
    created_at: datetime

    name: str
    fitness_goal: str

    workout_plan: Optional[str]
    duration: Optional[str] = None

    # ⚠️ SAFE DEFAULT (prevents mutable bugs)
    exercises: List[str] = Field(default_factory=list)

# ======================================================
# WORKOUT TIPS (GENERATION RESPONSE)
# ======================================================

class WorkoutTipsGenerateResponse(ORMBaseModel):
    warmup: List[str]
    workout: List[str]
    recovery: List[str]
    created_at: datetime

# ======================================================
# WORKOUT TIPS (SAVE REQUEST)
# ======================================================

class WorkoutTipsSave(BaseModel):
    tips: Dict

# ======================================================
# WORKOUT TIPS (GENERIC RESPONSE – COMPATIBILITY)
# ======================================================

class WorkoutTipsResponse(ORMBaseModel):
    id: int
    workout_id: Optional[int] = None
    tips: Dict
    created_at: datetime

# ======================================================
# WORKOUT TIPS HISTORY (STORED MEMORY)
# ======================================================

class WorkoutTipHistoryResponse(ORMBaseModel):
    id: int
    workout_id: Optional[int]
    tips: Dict
    created_at: datetime

# ======================================================
# DIET GENERATOR
# ======================================================

class DietCreate(BaseModel):
    name: str
    age: int

    weight: int
    weight_unit: str

    height: int
    height_unit: str

    blood_group: str
    fitness_goal: str
    medical_condition: str
    diet_preference: str


class DietResponse(ORMBaseModel):
    id: int
    user_id: Optional[int]

    name: str
    age: int

    weight: int
    weight_unit: str

    height: int
    height_unit: str

    blood_group: str
    fitness_goal: str
    medical_condition: str
    diet_preference: str

    diet_plan: Optional[str]
    created_at: datetime

# ======================================================
# CONTACT FORM
# ======================================================

class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    message: str

# ======================================================
# 🧠 NORMALIZED EXERCISE (AI MEMORY UNIT)
# ======================================================

class ExerciseBlock(BaseModel):
    name: str
    sets: Optional[int] = None
    reps: Optional[str] = None
    rest: Optional[str] = None


class NormalizedWorkout(BaseModel):
    exercises: List[ExerciseBlock]
# ======================================================
# 🧠 AI INSIGHTS RESPONSE
# ======================================================
class AIInsightResponse(BaseModel):
    id: int
    source: str
    insights: list[str]
    created_at: datetime

    class Config:
        from_attributes = True
