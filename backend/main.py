from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="متجر تيليغرام")

# يسمح للواجهة الأمامية بالتواصل مع البايثون
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# نقطة نهاية بسيطة للاختبار
@app.get("/api/hello")
def hello():
    return {"message": "مرحباً من بايثون! 🐍"}

# منتجات تجريبية
@app.get("/api/products")
def get_products():
    return [
        {"id": 1, "name": "سماعة لاسلكية", "price": 350, "image": "🎧"},
        {"id": 2, "name": "شاحن محمول", "price": 180, "image": "🔋"},
        {"id": 3, "name": "كابل شحن", "price": 45, "image": "🔌"}
    ]