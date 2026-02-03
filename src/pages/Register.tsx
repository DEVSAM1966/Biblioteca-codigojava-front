import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Library, Mail, Lock, User, Phone, MapPin, Badge } from 'lucide-react';

import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

import { registerApi } from '../utils/auth.api';
import { saveAuthData } from '../utils/auth.storage';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: '',
    dni: '',
    phone: '',
    email: '',
    password: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    country: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // ============================
    // VALIDACIONES BÁSICAS
    // ============================

    if (!formData.fullname.trim()) {
      toast.error("El nombre completo es obligatorio");
      setLoading(false);
      return;
    }

    if (!formData.dni.trim()) {
      toast.error("El DNI es obligatorio");
      setLoading(false);
      return;
    }

    const phoneRegex = /^\+?[0-9]{7,15}$/;
    if (!phoneRegex.test(formData.phone.trim())) {
      toast.error("El teléfono debe ser válido (7 a 15 dígitos)");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      toast.error("El correo electrónico no es válido");
      setLoading(false);
      return;
    }

    const password = formData.password.trim();
    const strongPasswordRegex =
      /^(?=(?:.*[a-z]){2,})(?=(?:.*[A-Z]){2,})(?=(?:.*\d){1,}).{8,}$/;

    if (!strongPasswordRegex.test(password)) {
      toast.error("La contraseña debe tener 8 caracteres, 2 minúsculas, 2 mayúsculas y 1 número");
      setLoading(false);
      return;
    }

    // ============================
    // ENVÍO AL BACKEND
    // ============================

    try {
      const payload = {
        fullname: formData.fullname.trim(),
        dni: formData.dni.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        password: formData.password.trim(),
        address: formData.address.trim() || undefined,
        city: formData.city.trim() || undefined,
        province: formData.province.trim() || undefined,
        postalCode: formData.postalCode.trim() || undefined,
        country: formData.country.trim() || undefined
      };

      const result = await registerApi(payload);

      // Guardar token y usuario → login automático
      saveAuthData(result.user, result.authorization);

      toast.success('Cuenta creada correctamente', {
        icon: '📚',
        style: { borderRadius: '10px', background: '#333', color: '#fff' }
      });

      navigate('/dashboard');

    } catch (error: any) {
      toast.error(error.message ?? 'Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat overflow-y-auto"

      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop')`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-gray-900/90 to-blue-900/90 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20">
          <div className="p-8">
            <div className="flex items-center justify-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, delay: 0.2 }}
                className="bg-white/10 p-3 rounded-xl backdrop-blur-sm"
              >
                <Library className="h-12 w-12 text-white" />
              </motion.div>
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-center text-white mb-8"
            >
              Crear Cuenta
            </motion.h2>

            <form onSubmit={handleSubmit} className="space-y-6">

              <InputField
                icon={<User className="h-5 w-5 text-white/60" />}
                placeholder="Nombre completo"
                value={formData.fullname}
                onChange={(v) => handleChange('fullname', v)}
                disabled={loading}
              />

              <InputField
                icon={<Badge className="h-5 w-5 text-white/60" />}
                placeholder="DNI"
                value={formData.dni}
                onChange={(v) => handleChange('dni', v)}
                disabled={loading}
              />

              <InputField
                icon={<Phone className="h-5 w-5 text-white/60" />}
                placeholder="Teléfono"
                value={formData.phone}
                onChange={(v) => handleChange('phone', v)}
                disabled={loading}
              />

              <InputField
                icon={<Mail className="h-5 w-5 text-white/60" />}
                placeholder="Correo electrónico"
                type="email"
                value={formData.email}
                onChange={(v) => handleChange('email', v)}
                disabled={loading}
              />

              <InputField
                icon={<Lock className="h-5 w-5 text-white/60" />}
                placeholder="Contraseña"
                type="password"
                value={formData.password}
                onChange={(v) => handleChange('password', v)}
                disabled={loading}
              />

              <InputField
                icon={<MapPin className="h-5 w-5 text-white/60" />}
                placeholder="Dirección"
                value={formData.address}
                onChange={(v) => handleChange('address', v)}
                disabled={loading}
              />

              <InputField
                icon={<MapPin className="h-5 w-5 text-white/60" />}
                placeholder="Ciudad"
                value={formData.city}
                onChange={(v) => handleChange('city', v)}
                disabled={loading}
              />

              <InputField
                icon={<MapPin className="h-5 w-5 text-white/60" />}
                placeholder="Provincia"
                value={formData.province}
                onChange={(v) => handleChange('province', v)}
                disabled={loading}
              />

              <InputField
                icon={<MapPin className="h-5 w-5 text-white/60" />}
                placeholder="Código postal"
                value={formData.postalCode}
                onChange={(v) => handleChange('postalCode', v)}
                disabled={loading}
              />

              <InputField
                icon={<MapPin className="h-5 w-5 text-white/60" />}
                placeholder="País"
                value={formData.country}
                onChange={(v) => handleChange('country', v)}
                disabled={loading}
              />

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl shadow-purple-500/25"
              >
                {loading ? "Creando cuenta..." : "Crear cuenta"}
              </motion.button>

            </form>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="py-4 text-center bg-white/5 backdrop-blur-sm border-t border-white/10"
          >
            <p className="text-white/80">
              ¿Ya tienes una cuenta?{' '}
              <Link
                to="/login"
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
              >
                Inicia sesión
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;

const InputField = ({
  icon,
  placeholder,
  value,
  onChange,
  disabled,
  type = "text"
}: {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
  type?: string;
}) => (
  <div className="relative">
    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
      {icon}
    </div>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-colors text-white placeholder-white/60"
      placeholder={placeholder}
      required
      disabled={disabled}
    />
  </div>
);
