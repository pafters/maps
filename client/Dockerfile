FROM node:latest

# ������������� ������� ���������� ������ ����������
WORKDIR /app

# �������� package.json � package-lock.json ��� ��������� ������������
COPY package*.json ./

# ������������� �����������
RUN npm install --force

# �������� ��� ��������� ����� � ������� ����������
COPY . .

# ��������� React-����������
CMD ["npm", "start"]