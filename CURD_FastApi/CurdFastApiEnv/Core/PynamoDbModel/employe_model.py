from pynamodb.models import Model
from pynamodb.attributes import UnicodeAttribute, NumberAttribute,UTCDateTimeAttribute
from Core.Setting.pynamodb_config import AWS_REGION,AWS_ACCESS_KEY_ID,AWS_SECRET_ACCESS_KEY

class EmployeeModel(Model):
    class Meta:
        table_name: str = 'Employee'  # DynamoDB table name
        region: str = AWS_REGION # example region
        aws_secret_access_key = AWS_SECRET_ACCESS_KEY
        aws_access_key_id = AWS_ACCESS_KEY_ID
        host = 'http://localhost:9000'
        write_capacity_units = 10
        read_capacity_units = 10
        
    employee_id = UnicodeAttribute(hash_key=True)
    create_date = UTCDateTimeAttribute(range_key=True)
    name = UnicodeAttribute()
    phone_no = UnicodeAttribute()
    age = NumberAttribute()