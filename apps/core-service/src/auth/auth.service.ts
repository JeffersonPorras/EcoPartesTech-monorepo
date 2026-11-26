import {
  Injectable,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { Pool } from 'pg';

@Injectable()
export class AuthService {
  private pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  async register(data: {
    usuario: string;
    correo?: string;
    password: string;
    rolId: number;
  }) {
    if (!data.usuario || !data.password || !data.rolId) {
      throw new BadRequestException(
        'usuario, password y rolId son obligatorios',
      );
    }

    const existingUser = await this.pool.query(
      'SELECT id FROM usuarios WHERE usuario = $1',
      [data.usuario],
    );

    if (existingUser.rowCount && existingUser.rowCount > 0) {
      throw new ConflictException('El nombre de usuario ya está en uso');
    }

    const roleExists = await this.pool.query(
      'SELECT id FROM roles WHERE id = $1',
      [data.rolId],
    );

    if (!roleExists.rowCount || roleExists.rowCount === 0) {
      throw new BadRequestException('El rol indicado no existe');
    }

    const passwordHash = await argon2.hash(data.password);

    const inserted = await this.pool.query(
      `INSERT INTO usuarios (usuario, correo, password_hash, rol_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, usuario, correo, rol_id, activo, creado_en`,
      [data.usuario, data.correo ?? null, passwordHash, data.rolId],
    );

    return {
      mensaje: 'Usuario registrado correctamente',
      usuario: inserted.rows[0],
    };
  }

  async login(data: { usuario: string; password: string }) {
    if (!data.usuario || !data.password) {
      throw new BadRequestException('usuario y password son obligatorios');
    }

    const result = await this.pool.query(
      `SELECT u.id, u.usuario, u.correo, u.password_hash, u.activo, r.nombre AS rol
       FROM usuarios u
       INNER JOIN roles r ON r.id = u.rol_id
       WHERE u.usuario = $1`,
      [data.usuario],
    );

    if (!result.rowCount || result.rowCount === 0) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const user = result.rows[0];

    if (!user.activo) {
      throw new UnauthorizedException('El usuario está inactivo');
    }

    const passwordOk = await argon2.verify(user.password_hash, data.password);

    if (!passwordOk) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return {
      mensaje: 'Inicio de sesión exitoso',
      usuario: {
        id: user.id,
        usuario: user.usuario,
        correo: user.correo,
        rol: user.rol,
      },
    };
  }
}