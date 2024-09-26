from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from . import models, schemas, database

router = APIRouter()

# 獲取所有數據
@router.get("/mytable", response_model=list[schemas.MyTableResponse])
def get_items(db: Session = Depends(database.get_db)):
    items = db.query(models.MyTable).all()
    return items

# 新增數據
@router.post("/mytable", response_model=schemas.MyTableResponse)
def create_item(item: schemas.MyTableCreate, db: Session = Depends(database.get_db)):
    db_item = models.MyTable(name=item.name)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

# 根據ID獲取單個數據
@router.get("/mytable/{item_id}", response_model=schemas.MyTableResponse)
def get_item(item_id: int, db: Session = Depends(database.get_db)):
    db_item = db.query(models.MyTable).filter(models.MyTable.ID == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return db_item
