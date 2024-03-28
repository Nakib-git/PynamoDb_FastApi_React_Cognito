from pynamodb.models import Model
from pynamodb.attributes import UnicodeAttribute, NumberAttribute,UTCDateTimeAttribute,MapAttribute
from Core.Setting.pynamodb_config import AWS_REGION,AWS_ACCESS_KEY_ID,AWS_SECRET_ACCESS_KEY

class UserOrganizationModel(MapAttribute):
    org_id=UnicodeAttribute()
    org_name = UnicodeAttribute()
    org_address = UnicodeAttribute(null=True)
    create_date = UTCDateTimeAttribute()

class UserModel(Model):
    class Meta:
        table_name: str = 'User'  # DynamoDB table name
        region: str = AWS_REGION # example region
        aws_secret_access_key = AWS_SECRET_ACCESS_KEY
        aws_access_key_id = AWS_ACCESS_KEY_ID
        host = 'http://localhost:9000'
        billing_mode = 'PAY_PER_REQUEST'
        
    user_id = UnicodeAttribute(hash_key=True)
    create_date = UTCDateTimeAttribute(range_key=True)
    name = UnicodeAttribute()
    email = UnicodeAttribute()
    password = UnicodeAttribute()
    organization = UserOrganizationModel(null=True)
    
class UserContactModel(Model):
    class Meta:
        table_name: str = 'UserContact'  # DynamoDB table name
        region: str = AWS_REGION # example region
        aws_secret_access_key = AWS_SECRET_ACCESS_KEY
        aws_access_key_id = AWS_ACCESS_KEY_ID
        host = 'http://localhost:9000'
        billing_mode = 'PAY_PER_REQUEST'
        
    contact_id = UnicodeAttribute(hash_key=True)
    user_id=UnicodeAttribute(range_key=True)
    create_date = UTCDateTimeAttribute()
    name = UnicodeAttribute()
    relation = UnicodeAttribute()

