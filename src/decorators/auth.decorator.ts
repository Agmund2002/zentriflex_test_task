import { UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'

export const ProtectedRoute = () => UseGuards(JwtAuthGuard)
