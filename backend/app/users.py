from pydantic import BaseModel
from typing import Optional

# User Implementation


##### Models #####

class PaymentInfo(BaseModel):
    credit_card: bool
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
    balance: int
    payment_info: PaymentInfo


