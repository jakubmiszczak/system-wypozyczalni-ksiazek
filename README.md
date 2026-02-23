# System Wypożyczalni Książek

## Funkcjonalności

1. **Dodawanie, aktualizacja, usuwanie rekordów do bazy danych**
   - **Książki**: admin
   - **Klienci**: user, admin
   - **Wypożyczenia**: user (w ramach stworzonych przez siebie), admin

2. **Wyświetlanie listy wszystkich rekordów dla każdej tabeli (tylko najważniejsze kolumny)**
   - **Książki**: guest, user, admin
   - **Klienci**: user, admin
   - **Wypożyczenia**: user, admin

3. **Wyświetlanie widoków szczegółowych (wszystkie kolumny + rekordy połączone relacjami)**
   - **Książki**: guest (nie widzi relacji), user, admin
   - **Klienci**: user, admin
   - **Wypożyczenia**: user (w ramach stworzonych przez siebie), admin

---

## Kroki do uruchomienia aplikacji

### 1. Instalacja zależności i uruchomienie aplikacji

#### Backend
1. Przejdź do katalogu backend:
   ```bash
   cd backend
   ```
2. Utwórz plik .env na podstawie .env.example  
   **Linux / macOS**
    ```bash
    cp .env.example .env
    ```
   **Windows (PowerShell)**
    ```bash
   Copy-Item .env.example .env
    ```
    Potem wypełnij wartość `JWT_SECRET`
3. Zainstaluj zależności:
   ```bash
   npm install
   ```
4. Uruchom serwer backend:
   ```bash
   npm start
   ```

#### Frontend
1. Przejdź do katalogu frontend:
   ```bash
   cd frontend
   ```
2. Zainstaluj zależności:
   ```bash
   npm install
   ```
3. Uruchom aplikację frontend:
   ```bash
   npm run dev
   ```

### 2. Dostęp do aplikacji
1. Frontend będzie dostępny pod adresem: `http://localhost:5173`
2. Backend będzie działał pod adresem: `http://localhost:3000`

---

## Istniejące loginy do kont

| Nazwa użytkownika | Hasło    | Rola  |
|-------------------|----------|-------|
| admin             | password | admin |
| user              | password | user  |
| user2             | password | user  |
