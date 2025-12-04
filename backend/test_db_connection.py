import pyodbc

print("Installed ODBC Drivers:")
drivers = pyodbc.drivers()
for driver in drivers:
    print(f" - {driver}")

print("\nAttempting connection with default string...")
conn_str = "DRIVER={ODBC Driver 17 for SQL Server};SERVER=localhost;DATABASE=KaiLabs;Trusted_Connection=yes;"
try:
    conn = pyodbc.connect(conn_str, timeout=5)
    print("Successfully connected to localhost!")
    conn.close()
except Exception as e:
    print(f"Connection to localhost failed: {e}")

print("\nAttempting connection with SQLEXPRESS...")
conn_str_express = "DRIVER={ODBC Driver 17 for SQL Server};SERVER=localhost\\SQLEXPRESS;DATABASE=KaiLabs;Trusted_Connection=yes;"
try:
    conn = pyodbc.connect(conn_str_express, timeout=5)
    print("Successfully connected to localhost\\SQLEXPRESS!")
    conn.close()
except Exception as e:
    print(f"Connection to SQLEXPRESS failed: {e}")
