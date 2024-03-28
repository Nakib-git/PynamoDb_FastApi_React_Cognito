from Core.PynamoDbModel.user_model import UserModel,UserContactModel,UserOrganizationModel
from Core.Model.models import User,UserContact,UserOrganization,EmailVerfication,Login
from fastapi import APIRouter, HTTPException, Query
import uuid
from datetime import datetime, timedelta
from pynamodb.exceptions import DoesNotExist, DeleteError, UpdateError
import boto3
from pynamodb.pagination import ResultIterator

user_router=APIRouter();

#aws cognito config
COGNITO_REGION = "us-east-2"
CLIENT_ID= "1a4ou6taon6on7spbva70tuol0"
cognito = boto3.client("cognito-idp", region_name=COGNITO_REGION)


@user_router.post("/createUserTable")
def create_user_table():
    if not UserModel.exists():
        UserModel.create_table(wait=True)
        return {"message": "User table created  successfully"}
    else:
        return {"message": "User table already created  successfully"}
    
@user_router.delete("/userTableDelete")
def delete_user_table():
    if  UserModel.exists():
        UserModel.delete_table()
        return {"message": "User table deleted  successfully"}

@user_router.post("/createUserContactTable")
def create_user_contact_table():
    if not UserContactModel.exists():
        UserContactModel.create_table(wait=True)
        return {"message": "User contact table created  successfully"}
    else:
        return {"message": "User contact table already created  successfully"}
    
@user_router.delete("/userContactTableDelete")
def delete_user_contact_table():
    if  UserContactModel.exists():
        UserContactModel.delete_table()
        return {"message": "User contact table deleted  successfully"}

@user_router.get("/getAllUser")
def get_all_employee() -> list[User]:
    users: ResultIterator[UserModel] = UserModel.scan()
    userList: list[User]= [User(
        userId= user.user_id,
        name=user.name,
        password=user.password,
        email=user.email,
        createDate=user.create_date,
        organization=UserOrganization(orgId=user.organization.org_id,orgName=user.organization.org_name,createDate=user.organization.create_date,orgAddress= user.organization.org_address) if user.organization is not None else None
        ) for user in users]
    return userList

@user_router.get("/getById/{userId}/date/{createDate}")
def get_by_id(userId: str,createDate:datetime):
    #PynamoDB
    user= UserModel.get(userId,createDate)
    if user is None:
       raise HTTPException(status_code=404, detail="Employee not found")
    userViewModel=User(
        userId=user.user_id,
        name=user.name,
        email=user.email,
        password=user.password,
        createDate=user.create_date,
        organization=UserOrganization(orgId=user.organization.org_id,orgName=user.organization.org_name,createDate=user.organization.create_date,orgAddress= user.organization.org_address)if user.organization is not None else None
    )
    
    userContactList=UserContactModel.scan(filter_condition=UserContactModel.user_id.contains(userId))
    if userContactList is not None:
         contactList= [UserContact(
             contactId= item.contact_id,
             userId=item.user_id,
             name=item.name,
             relation=item.relation,
             createDate=item.create_date
             ) for item in userContactList]
         userViewModel.contactList=contactList
         
    return userViewModel

#signup user
@user_router.post("/signup")
def signup(data:User):
    # Call AWS Cognito API to register the user
    try:
        cognito.sign_up(
            ClientId=CLIENT_ID,
            Username=data.email,
            Password=data.password,
            UserAttributes=[
                {'Name': 'email', 'Value': data.email}
                # Add other user attributes as needed
            ]
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Optionally, save user data to DynamoDB using PynamoDB
    if UserModel.exists():
        user = UserModel(
            user_id = str(uuid.uuid4()),
            create_date = datetime.now(),
            name = data.name,
            email = data.email,
            password = data.password,
            organization = None
            )
        user.save()
        return user.attribute_values
    else:
         raise HTTPException(status_code=404, detail="User table not found")
     
#verification Email
@user_router.post("/verification")
async def verification(data: EmailVerfication):
    try:
        # Confirm the user sign-up
        response = cognito.confirm_sign_up(
            ClientId=CLIENT_ID,  # Replace with your Cognito app client ID
            Username=data.email,
            ConfirmationCode=data.verficationCode
        )
        return response
    except cognito.exceptions.UserNotFoundException:
        print("User not found.")
    except cognito.exceptions.CodeMismatchException:
        print("Verification code does not match.")
    except cognito.exceptions.ExpiredCodeException:
        print("Verification code has expired.")
    except Exception as e:
        print("An error occurred:", str(e))

# Login in endpoint
@user_router.post("/login")
async def log_in(data: Login):
    try:
        # Authenticate user with Cognito
        response = cognito.initiate_auth(
            ClientId=CLIENT_ID,  # Replace with your Cognito app client ID
            AuthFlow="USER_PASSWORD_AUTH",
            AuthParameters={"USERNAME": data.email, "PASSWORD": data.password}
        )

        # Generate JWT token
        token = response["AuthenticationResult"]["AccessToken"]
        return token
    except cognito.exceptions.UserNotFoundException:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    except cognito.exceptions.NotAuthorizedException:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@user_router.post("/addUser/")
def submit_user(data:User):
  #PynamoDb
  if UserModel.exists():
    user = UserModel(
        user_id = str(uuid.uuid4()),
        create_date = datetime.now(),
        name = data.name,
        email = data.email,
        password = data.password,
        organization = None
        )
    user.save()
    return user.attribute_values
  else:
    raise HTTPException(status_code=404, detail="User table not found")

@user_router.post("/addUserContact/{userId}")
def add_user_contact(userId: str,data:UserContact):
  #PynamoDb
     existingUser= UserModel.get(userId)
     if existingUser is None:
         raise HTTPException(status_code=404, detail="Employee not found")
     if UserContactModel.exists():
         userContact=UserContactModel(
             user_id= userId,
             contact_id= str(uuid.uuid4()),
             name= data.name,
             relation= data.relation,
             create_date= datetime.now()
         )
         userContact.save()
     else:
         raise HTTPException(status_code=404, detail="User contact table not found")

@user_router.put("/updateUser/{userId}/{createDate}")
def update_item(userId: str,createDate:datetime, user: User):
    #PynamoDB
    try:
        user_to_update = UserModel.get(hash_key=userId,range_key=createDate)
        update_org= user_to_update.organization
        if user.organization is not None and update_org is None:
            update_org=UserOrganizationModel(
                    org_id = str(uuid.uuid4()),
                    org_name = user.organization.orgName,
                    org_address=user.organization.orgAddress,
                    create_date = datetime.now()
                    ) 
        elif user.organization is not None and update_org is not None:
            update_org.org_name=user.organization.orgName
            update_org.org_address=user.organization.orgAddress
            
        user_to_update.update(actions=[
            UserModel.name.set(user.name),
            UserModel.email.set(user.email),
            UserModel.password.set(user.password),
            UserModel.organization.set(update_org)    
        ])
        return user_to_update
    except DoesNotExist:
        raise HTTPException(status_code=404, detail="User not found")
    except UpdateError:
        raise HTTPException(status_code=500, detail="Failed to update User")

@user_router.delete("/deleteUser/{userId}/{createDate}")
def delete_item(userId: str,createDate:datetime):
    #PynamoDb
    try:
        user: UserModel = UserModel.get(hash_key=userId,range_key=createDate)
        user.delete()
        return {"message": "User deleted successfully"}
    except DoesNotExist:
        raise HTTPException(status_code=404, detail="User not found")
    except DeleteError:
        raise HTTPException(status_code=500, detail="Failed to delete User")
    
@user_router.get("/getUserListByName/{name}")
async def get_employee_list_by_name(name: str):
    #PynamoDb
    condition = None
    if name:
       condition &= UserModel.name.contains(name)
    
    users = UserModel.scan(filter_condition=condition)
    userList: list[User]= [User(
        userId= user.user_id,
        name=user.name,
        password=user.password,
        email=user.email,
        createDate=user.create_date,
        organization=UserOrganization(orgId=user.organization.org_id,orgName=user.organization.org_name,createDate=user.organization.create_date,orgAddress= user.organization.org_address) if user.organization is not None else None
        ) for user in users]
    return userList;

@user_router.get("/getUserListByDateRange/")
async def get_employee_list_by_date_range(start_date: datetime = Query(None), end_date: datetime = Query(None)):
    # Get the start of the day
    start_of_day = datetime.combine(start_date, datetime.min.time())

    # Get the end of the day (11:59:59 PM)
    end_of_day = datetime.combine(end_date, datetime.max.time()) - timedelta(microseconds=1)
    range_key_condition = None
    if start_date and end_date:
        range_key_condition= UserModel.create_date.between(start_of_day,end_of_day)
    elif start_date:
        range_key_condition = UserModel.create_date >= start_of_day
    elif end_date:
        range_key_condition &= UserModel.create_date <= end_of_day

    users = UserModel.scan(filter_condition=range_key_condition)
    userList: list[User]= [User(
        userId= user.user_id,
        name=user.name,
        password=user.password,
        email=user.email,
        createDate=user.create_date,
        organization=UserOrganization(orgId=user.organization.org_id,orgName=user.organization.org_name,createDate=user.organization.create_date,orgAddress= user.organization.org_address) if user.organization is not None else None
        ) for user in users]
    return userList
    
       
   
   