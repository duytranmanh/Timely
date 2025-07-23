FROM python:3
WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN python manage.py migrate --noinput
RUN python manage.py collectstatic --noinput

EXPOSE 8000

# Start Gunicorn (production-ready)
CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8000"]