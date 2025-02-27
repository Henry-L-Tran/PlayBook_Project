from pydantic import BaseModel
from typing import Optional

# User Implementation

class PaymentInfo(BaseModel):
    credit_card: bool
    bank_account: bool
    card_type: Optional[str] = None
    card_number: Optional[str] = None
    expiration_date: Optional[str] = None
    cvv: Optional[str] = None

class RegisterUser(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str
    address: str
    birthday: str
    payment_info: PaymentInfo


