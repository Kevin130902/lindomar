from django.urls import path
from .views import buscar_curso_disciplina, listar_disciplinas, listar_professores, ProfessoresView, ProfessoresDetailView, buscar_nome_professor, ProfessoresSearchView

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('professores', listar_professores),
    path('disciplinas', listar_disciplinas),
    path('prof', ProfessoresView.as_view()),
    path('id/<int:pk>', ProfessoresDetailView.as_view()),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('buscar/nome/', buscar_nome_professor),
    path('buscar/curso/', buscar_curso_disciplina),
    path('search/', ProfessoresSearchView.as_view()),
]
