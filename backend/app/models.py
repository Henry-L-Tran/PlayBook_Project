from pydantic import BaseModel

# User Implementation

class PaymentInfo(BaseModel):
    credit_card: bool
    bank_account: bool
    card_type: str
    card_number: int
    expiration_date: str
    cvv: int

class RegisterUser(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str
    address: str
    birthday: str
    payment_info: PaymentInfo


