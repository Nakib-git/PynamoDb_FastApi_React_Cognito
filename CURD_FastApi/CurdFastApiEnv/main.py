from fastapi import FastAPI
from Employee.employee import employee_router
from User.user import user_router
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

app=FastAPI();
app.include_router(employee_router)
app.include_router(user_router)
origins=[
    'http://localhost:3000'
]
app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=['*'],
  allow_headers=['*']
)

handler=Mangum(app)
@app.get("/")
def red_root():
    return {"Hellow": "Word"}
