from rest_framework import permissions

class IsAdminUser(permissions.BasePermission):
    """
    Allows access only to admin users.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'admin'

class IsStandardUser(permissions.BasePermission):
    """
    Allows access only to standard users.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'standard'

class ReadOnly(permissions.BasePermission):
    """
    Allows read-only access.
    """
    def has_permission(self, request, view):
        return request.method in permissions.SAFE_METHODS

class AdminOrReadOnly(permissions.BasePermission):
    """
    Allows read access to all users, but write access only to admin users.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated and request.user.role == 'admin'
