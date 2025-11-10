import sys, os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

import pandas as pd
from services.db import SessionLocal, Base, engine
from models.machine import Machine
from models.production import Production
from models.machine_log import MachineLog
from services.code_generator import generate_machine_code, generate_product_code
import random
from datetime import datetime, timedelta

# 1️⃣ Inisialisasi DB
Base.metadata.create_all(bind=engine)
session = SessionLocal()

def seed_from_csv(csv_path="datasets/ai4i2020.csv"):
    df = pd.read_csv(csv_path)

    # Cek apakah data sudah ada
    if session.query(MachineLog).count() > 0:
        print("⚠️ Data sudah ada di database. Skip seeding.")
        return

    print("🚀 Memulai proses seeding data...")

    # 2️⃣ Buat daftar mesin unik
    machine_types = df["Type"].unique().tolist()
    machines = []

    for m_type in machine_types:
        machine = Machine(
            machine_code=generate_machine_code(session),
            type=m_type
        )
        session.add(machine)
        session.flush()
        machines.append(machine)
    session.commit()

    # 3️⃣ Buat daftar produk (contoh 5 produk random)
    products = []
    for i in range(5):
        product = Production(
            product_code=generate_product_code(session),
            product_name=f"Product {chr(65+i)}AB"
        )
        session.add(product)
        session.flush()
        products.append(product)
    session.commit()

    # 4️⃣ Buat log machine berdasarkan dataset
    for _, row in df.iterrows():
        log = MachineLog(
            machine_id=random.choice(machines).id,
            product_id=random.choice(products).id,
            air_temperature=row["Air temperature [K]"],
            process_temperature=row["Process temperature [K]"],
            rotational_speed=row["Rotational speed [rpm]"],
            torque=row["Torque [Nm]"],
            tool_wear=row["Tool wear [min]"],
            prediction=random.choice(["Rusak", "Tidak Rusak"]),
            created_at=datetime.utcnow() - timedelta(minutes=random.randint(1, 10000))
        )
        session.add(log)

    session.commit()
    print("✅ Seeding selesai! Data berhasil dimasukkan ke database.")

if __name__ == "__main__":
    seed_from_csv()
