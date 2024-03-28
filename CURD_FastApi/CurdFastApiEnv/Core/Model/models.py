from pydantic import BaseModel
from datetime import datetime

class Employee(BaseModel):
    employeeId: str
    name: str
    age: float
    phoneNo: str
    createDate:datetime

class UserOrganization(BaseModel):
    orgId: str
    orgName: str
    orgAddress: str|None
    createDate:datetime
    
class UserContact(BaseModel):
    contactId: str
    userId: str
    name: str
    relation: str
    createDate:datetime
    
class User(BaseModel):
    userId: str
    name: str
    email: str
    password: str
    createDate:datetime
    organization:UserOrganization|None
    contactList: list[UserContact] = []
    
class EmailVerfication(BaseModel):
    verficationCode: str
    email: str

class Login(BaseModel):
    email: str
    password: str
