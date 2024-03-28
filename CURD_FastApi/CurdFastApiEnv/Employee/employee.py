from Core.PynamoDbModel.employe_model import EmployeeModel
from Core.Model.models import Employee
from fastapi import APIRouter, HTTPException, Query
import uuid
from datetime import datetime, timedelta
from pynamodb.exceptions import DoesNotExist, DeleteError, UpdateError
from datetime import datetime

employee_router=APIRouter();

@employee_router.post("/createEmployeeTable")
def create_employee_table():
    if not EmployeeModel.exists():
        EmployeeModel.create_table(wait=True)
        return {"message": "Employee table created  successfully"}

@employee_router.get("/getAllEmployees")
def get_all_employee():
    items = EmployeeModel.scan()
    employeeList= [Employee(employeeId= item.employee_id,name=item.name,age=item.age,phoneNo=item.phone_no,createDate=item.create_date) for item in items]
    return employeeList
@employee_router.post("/addEmployee/")
def submit_employee(data:Employee):
  #PynamoDb
  if EmployeeModel.exists():
    employee = EmployeeModel(
        employee_id = str(uuid.uuid4()),
        create_date = data.createDate,
        name = data.name,
        phone_no = data.phoneNo,
        age = data.age)
    employee.save()
    return employee.attribute_values
  else:
    raise HTTPException(status_code=404, detail="Employee table not found")

@employee_router.put("/updateEmployee/{employeeId}/{createDate}")
def update_item(employeeId: str,createDate:datetime, employee: Employee):
    #PynamoDB
    try:
        emp_to_update = EmployeeModel.get(hash_key=employeeId,range_key=createDate)
        emp_to_update.update(actions=[
            EmployeeModel.name.set(employee.name),
            EmployeeModel.phone_no.set(employee.phoneNo),
            EmployeeModel.age.set(employee.age)
        ])
        return emp_to_update
    except DoesNotExist:
        raise HTTPException(status_code=404, detail="Employee not found")
    except UpdateError:
        raise HTTPException(status_code=500, detail="Failed to update employee")

@employee_router.delete("/deleteEmployee/{employeeId}/{createDate}")
def delete_item(employeeId: str,createDate:datetime):
    #PynamoDb
    try:
        employee = EmployeeModel.get(hash_key=employeeId,range_key=createDate)
        employee.delete()
        return {"message": "Employee deleted successfully"}
    except DoesNotExist:
        raise HTTPException(status_code=404, detail="Employee not found")
    except DeleteError:
        raise HTTPException(status_code=500, detail="Failed to delete employee")

@employee_router.get("/getEmployeeListByName/{name}")
async def get_employee_list_by_name(name: str):
    #PynamoDb
    condition = None
    if name:
       condition &= EmployeeModel.name.contains(name)
    
    items = EmployeeModel.scan(filter_condition=condition)
    employeeList= [Employee(employeeId= item.employee_id,name=item.name,age=item.age,phoneNo=item.phone_no,createDate=item.create_date) for item in items]
    return employeeList

@employee_router.get("/getEmployeeListByDateRange/")
async def get_employee_list_by_date_range(start_date: datetime = Query(None), end_date: datetime = Query(None)):
    # Get the start of the day
    start_of_day = datetime.combine(start_date, datetime.min.time())

    # Get the end of the day (11:59:59 PM)
    end_of_day = datetime.combine(end_date, datetime.max.time()) - timedelta(microseconds=1)
    range_key_condition = None
    if start_date and end_date:
        range_key_condition= EmployeeModel.create_date.between(start_of_day,end_of_day)
    elif start_date:
        range_key_condition = EmployeeModel.create_date >= start_of_day
    elif end_date:
        range_key_condition &= EmployeeModel.create_date <= end_of_day

    items = EmployeeModel.scan(filter_condition=range_key_condition)
    employeeList= [Employee(employeeId= item.employee_id,name=item.name,age=item.age,phoneNo=item.phone_no,createDate=item.create_date) for item in items]
    return employeeList
