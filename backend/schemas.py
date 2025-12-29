from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# =========================
# USER BASE (Shared Fields)
# =========================
class UserBase(BaseModel):
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    username: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    zip_code: Optional[str] = None
    country: Optional[str] = None
    profile_image: Optional[str] = None


# =========================
# SIGNUP SCHEMA
# =========================
class UserCreate(UserBase):
    password: str


# =========================
# LOGIN SCHEMA
# =========================
class UserLogin(BaseModel):
    email: EmailStr
    password: str


# =========================
# USER RESPONSE (DB OUTPUT)
# =========================
class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True  # Pydantic v2
        orm_mode = True         # Pydantic v1 compatibility


# =========================
# PROFILE UPDATE (PUT /me)
# =========================
class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    username: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    zip_code: Optional[str] = None
    country: Optional[str] = None
    profile_image: Optional[str] = None


# =========================
# CHANGE PASSWORD
# =========================
class ChangePassword(BaseModel):
    old_password: str
    new_password: str
    confirm_password: str


# =========================
# TOKEN RESPONSE
# =========================
class Token(BaseModel):
    access_token: str
    token_type: str


# ======================================================
# WORKOUT GENERATOR SCHEMAS
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


class WorkoutResponse(BaseModel):
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

    class Config:
        from_attributes = True
        orm_mode = True


# ======================================================
# DIET GENERATOR SCHEMAS (NEW – ADDED SAFELY)
# ======================================================

class DietCreate(BaseModel):
    name: str
    age: int

    weight: int
    weight_unit: str          # kg | lbs

    height: int
    height_unit: str          # cm | inches

    blood_group: str

    fitness_goal: str
    medical_condition: str
    diet_preference: str


class DietResponse(DietCreate):
    id: int
    user_id: Optional[int]
    diet_plan: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
        orm_mode = True

# =========================
# CONTACT FORM SCHEMA
# =========================
class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    message: str
