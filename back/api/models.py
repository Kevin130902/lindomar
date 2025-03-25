from django.db import models

# Professor
class Cadastro(models.Model):
    ni = models.CharField(max_length=15)
    nome = models.CharField(max_length=255)
    email = models.EmailField()
    cel = models.CharField(max_length=255)
    ocup = models.FloatField()

class Disciplina(models.Model):
    sigla = models.CharField(max_length=3)
    curso = models.CharField(max_length=255)
    semestre = models.IntegerField()
    carga_horaria = models.IntegerField()

class Ambiente(models.Model):
    sala = models.CharField(max_length=255)
    capacidade = models.IntegerField()
    responsavel = models.CharField(max_length=255)
    periodo = models.CharField(choices=[('M', 'M'), ('T', 'T'), ('N', 'N'), ('S', 'S')], max_length=1)

class Curso(models.Model):
    curso = models.CharField(max_length=255)
    tipo = models.CharField(choices=[('CAI', 'CAI'), ('CT', 'CT'), ('CS', 'CS'), ('FIC', 'FIC')], max_length=3)
    hora_aula = models.IntegerField()
    sigla = models.CharField(max_length=3)

class Turma(models.Model):
    nome = models.CharField(max_length=255)