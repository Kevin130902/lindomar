from django.urls import path
from .views import (
    listar, buscar_curso_disciplina, buscar_nome_professor,
    ProfessoresView, ProfessoresDetailView, ProfessoresSearchView,
    DisciplinasDetailView, TurmaDetailView, AmbienteDetailView,
    CursoDetailView
)

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('professores', listar('professores')),
    path('professores/id/<int:pk>', ProfessoresDetailView.as_view()),
    path('disciplinas', listar('disciplinas')),
    path('disciplinas/id/<int:pk>', DisciplinasDetailView.as_view()),
    path('turma', listar('turma')),
    path('turma/id/<int:pk>', TurmaDetailView.as_view()),
    path('curso', listar('curso')),
    path('curso/id/<int:pk>', CursoDetailView.as_view()),
    path('ambiente', listar('ambiente')),
    path('ambiente/id/<int:pk>', AmbienteDetailView.as_view()),

    path('prof', ProfessoresView.as_view()),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('buscar/nome/', buscar_nome_professor),
    path('buscar/curso/', buscar_curso_disciplina),
    path('search/', ProfessoresSearchView.as_view()),
]
