<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    protected $table = 'usuarios';

    protected $primaryKey = 'id_usuario';

    public $rememberTokenName = 'serial_autenticacion';

    public $timestamps = false;

    protected $fillable = [
        'id_usuario',
        'nombre_usuario',
        'contrasena',
        'usuario',
        'correo',
        'id_sucursal',
        'id_entidad',
        'id_cajero',
        'id_oficial',
        'id_cobrador',
        'depurador',
        'contrasena_encriptada',
        'serial_autenticacion',
        'id_estado',
    ];

    protected $hidden = ['contrasena'];

    public function getAuthPassword() { return $this->contrasena; }

    public function getAuthIdentifier() { return $this->id_usuario; }

}
