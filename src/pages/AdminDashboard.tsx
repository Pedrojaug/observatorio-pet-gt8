import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Save, AlertCircle, CheckCircle2, Lock, LogOut, User, FileText, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';

interface PostFormData {
  title: string;
  summary: string;
  content: string;
  tipo_conteudo: string;
  gt_origem: string;
  territorio: string;
  data: string;
}

interface ProfileFormData {
  full_name: string;
  gt_origem: string;
  cargo: string;
  territorio: string;
  bio: string;
}

type AuthView = 'login' | 'signup' | 'forgot_password' | 'reset_password';

export default function AdminDashboard() {
  const {
    register: registerPost,
    handleSubmit: handleSubmitPost,
    reset: resetPost,
    formState: { errors: postErrors, isSubmitting: isPostSubmitting },
  } = useForm<PostFormData>();

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    reset: resetProfile,
    formState: { isSubmitting: isProfileSubmitting },
  } = useForm<ProfileFormData>();

  const [postStatus, setPostStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [postErrorMessage, setPostErrorMessage] = useState('');
  const [profileStatus, setProfileStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [profileErrorMessage, setProfileErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'publish' | 'profile'>('publish');

  const [session, setSession] = useState<Session | null>(null);
  const [authView, setAuthView] = useState<AuthView>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        // Usuário voltou pelo link de reset — mostra formulário de nova senha
        setAuthView('reset_password');
        setAuthError('');
        setAuthSuccess('');
        return;
      }
      setSession(session);
      if (session) fetchProfile(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (data) {
      resetProfile({
        full_name: data.full_name ?? '',
        gt_origem: data.gt_origem ?? '',
        cargo: data.cargo ?? '',
        territorio: data.territorio ?? '',
        bio: data.bio ?? '',
      });
    }
  };

  const clearAuthMessages = () => { setAuthError(''); setAuthSuccess(''); };

  const goTo = (view: AuthView) => { setAuthView(view); clearAuthMessages(); };

  // --- Handlers de autenticação ---

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true); clearAuthMessages();
    const { error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword });
    if (error) setAuthError('Credenciais inválidas. Verifique seu e-mail e senha.');
    setAuthLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true); clearAuthMessages();
    const { error } = await supabase.auth.signUp({
      email: authEmail,
      password: authPassword,
      options: { emailRedirectTo: `${window.location.origin}/cadastro-oculto-gt` },
    });
    if (error) {
      setAuthError(error.message);
    } else {
      setAuthSuccess('Cadastro realizado! Verifique sua caixa de e-mail para confirmar a conta.');
    }
    setAuthLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true); clearAuthMessages();
    const { error } = await supabase.auth.resetPasswordForEmail(authEmail, {
      redirectTo: `${window.location.origin}/cadastro-oculto-gt`,
    });
    if (error) {
      setAuthError(error.message);
    } else {
      setAuthSuccess('E-mail de recuperação enviado! Verifique sua caixa de entrada.');
    }
    setAuthLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthMessages();
    if (newPassword !== confirmPassword) {
      setAuthError('As senhas não coincidem.');
      return;
    }
    if (newPassword.length < 6) {
      setAuthError('A senha precisa ter ao menos 6 caracteres.');
      return;
    }
    setAuthLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setAuthError(error.message);
    } else {
      setAuthSuccess('Senha atualizada com sucesso! Você já está logado.');
      setAuthView('login');
      // A sessão já está ativa após o updateUser — o onAuthStateChange cuidará do redirect
    }
    setAuthLoading(false);
  };

  const onSaveProfile = async (data: ProfileFormData) => {
    if (!session) return;
    setProfileStatus('idle');
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: session.user.id, ...data, updated_at: new Date().toISOString() });
    if (error) {
      setProfileStatus('error');
      setProfileErrorMessage(error.message);
    } else {
      setProfileStatus('success');
      setTimeout(() => setProfileStatus('idle'), 4000);
    }
  };

  const onSubmitPost = async (data: PostFormData) => {
    setPostStatus('idle');
    try {
      const { error } = await supabase.from('posts').insert([data]);
      if (error) throw error;
      setPostStatus('success');
      resetPost();
      setTimeout(() => setPostStatus('idle'), 5000);
    } catch (err: any) {
      setPostStatus('error');
      setPostErrorMessage(err.message || 'Erro ao salvar a publicação.');
    }
  };

  // --- Telas de autenticação ---

  if (!session || authView === 'reset_password') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-6">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">

          {/* Ícone */}
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-blue-50 rounded-full text-blue-600">
              <Lock className="w-8 h-8" />
            </div>
          </div>

          {/* Título */}
          <h1 className="text-2xl font-bold text-center text-slate-900 mb-2">
            {authView === 'login' && 'Acesso Restrito'}
            {authView === 'signup' && 'Criar Conta'}
            {authView === 'forgot_password' && 'Recuperar Senha'}
            {authView === 'reset_password' && 'Nova Senha'}
          </h1>

          {authView === 'forgot_password' && (
            <p className="text-center text-sm text-slate-500 mb-6">
              Informe seu e-mail e enviaremos um link para redefinir sua senha.
            </p>
          )}
          {authView === 'reset_password' && (
            <p className="text-center text-sm text-slate-500 mb-6">
              Escolha uma nova senha para a sua conta.
            </p>
          )}

          {/* Mensagens */}
          {authError && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />{authError}
            </div>
          )}
          {authSuccess && (
            <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 text-sm rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />{authSuccess}
            </div>
          )}

          {/* Formulário: Login */}
          {authView === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
                <input type="email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} required
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
                <input type="password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} required
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none" />
              </div>
              <button type="submit" disabled={authLoading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-70">
                {authLoading ? 'Aguarde...' : 'Entrar'}
              </button>
              <div className="flex flex-col items-center gap-2 pt-2">
                <button type="button" onClick={() => goTo('forgot_password')}
                  className="text-sm text-blue-600 hover:underline font-medium">
                  Esqueci minha senha
                </button>
                <button type="button" onClick={() => goTo('signup')}
                  className="text-sm text-slate-500 hover:text-blue-600 font-medium transition-colors">
                  Precisa de acesso? Cadastre-se
                </button>
              </div>
            </form>
          )}

          {/* Formulário: Cadastro */}
          {authView === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">E-mail Institucional</label>
                <input type="email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} required
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
                <input type="password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} required
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none" />
              </div>
              <button type="submit" disabled={authLoading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-70">
                {authLoading ? 'Aguarde...' : 'Criar Conta'}
              </button>
              <div className="flex justify-center pt-2">
                <button type="button" onClick={() => goTo('login')}
                  className="text-sm text-slate-500 hover:text-blue-600 font-medium flex items-center gap-1 transition-colors">
                  <ArrowLeft className="w-3 h-3" /> Voltar ao login
                </button>
              </div>
            </form>
          )}

          {/* Formulário: Esqueci minha senha */}
          {authView === 'forgot_password' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">E-mail da sua conta</label>
                <input type="email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} required
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  placeholder="seu@email.com" />
              </div>
              <button type="submit" disabled={authLoading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-70">
                {authLoading ? 'Enviando...' : 'Enviar link de recuperação'}
              </button>
              <div className="flex justify-center pt-2">
                <button type="button" onClick={() => goTo('login')}
                  className="text-sm text-slate-500 hover:text-blue-600 font-medium flex items-center gap-1 transition-colors">
                  <ArrowLeft className="w-3 h-3" /> Voltar ao login
                </button>
              </div>
              <div className="mt-4 p-3 bg-slate-50 rounded-lg text-xs text-slate-500 text-center">
                Não lembra o e-mail que usou? Entre em contato com o administrador do Observatório.
              </div>
            </form>
          )}

          {/* Formulário: Nova senha (após clicar no link do e-mail) */}
          {authView === 'reset_password' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nova Senha</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required
                  placeholder="Mínimo 6 caracteres"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Confirmar Nova Senha</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none" />
              </div>
              <button type="submit" disabled={authLoading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-70">
                {authLoading ? 'Salvando...' : 'Salvar nova senha'}
              </button>
            </form>
          )}

        </div>
      </div>
    );
  }

  // --- Painel principal (logado) ---

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-3xl mx-auto space-y-6">

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Painel do Observatório</h1>
            <p className="text-slate-500 text-sm mt-0.5">{session.user.email}</p>
          </div>
          <button onClick={() => supabase.auth.signOut()}
            className="text-slate-500 hover:text-red-600 flex items-center gap-2 text-sm font-medium transition-colors">
            <LogOut className="w-4 h-4" /> Sair
          </button>
        </div>

        <div className="flex gap-2">
          <button onClick={() => setActiveTab('publish')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === 'publish' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
            <FileText className="w-4 h-4" /> Publicar Material
          </button>
          <button onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === 'profile' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
            <User className="w-4 h-4" /> Meu Perfil
          </button>
        </div>

        {/* Aba: Meu Perfil */}
        {activeTab === 'profile' && (
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Meu Perfil</h2>

            {profileStatus === 'success' && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3 text-emerald-800">
                <CheckCircle2 className="w-5 h-5" /><p className="font-medium">Perfil salvo com sucesso!</p>
              </div>
            )}
            {profileStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-800">
                <AlertCircle className="w-5 h-5" /><p className="font-medium">Erro: {profileErrorMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmitProfile(onSaveProfile)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                <input {...registerProfile('full_name')}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  placeholder="Seu nome completo" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">GT de Origem</label>
                  <select {...registerProfile('gt_origem')}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 bg-white">
                    <option value="">Selecione...</option>
                    <option value="GT 01">GT 01</option>
                    <option value="GT 08">GT 08</option>
                    <option value="GT 12">GT 12</option>
                    <option value="Diversos">Diversos / Inter-GT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Cargo / Função</label>
                  <input {...registerProfile('cargo')}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    placeholder="Ex: Residente, Preceptor..." />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Território de Atuação</label>
                <input {...registerProfile('territorio')}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  placeholder="Ex: USF Alto do Céu, Cabedelo..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Bio Curta</label>
                <textarea {...registerProfile('bio')}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none h-24 resize-none"
                  placeholder="Uma linha sobre você e seu trabalho no GT." />
              </div>
              <div className="pt-2 flex justify-end">
                <button type="submit" disabled={isProfileSubmitting}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                  {isProfileSubmitting ? 'Salvando...' : <><Save className="w-5 h-5" /> Salvar Perfil</>}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Aba: Publicar Material */}
        {activeTab === 'publish' && (
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
            <div className="mb-8 border-b pb-6">
              <h2 className="text-xl font-bold text-slate-900">Cadastro de Material</h2>
              <p className="text-slate-500 mt-1">Preencha os dados abaixo para publicar um novo relato, pesquisa ou material educativo no Observatório.</p>
            </div>

            {postStatus === 'success' && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3 text-emerald-800">
                <CheckCircle2 className="w-5 h-5" /><p className="font-medium">Material publicado com sucesso no Observatório!</p>
              </div>
            )}
            {postStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-800">
                <AlertCircle className="w-5 h-5" /><p className="font-medium">Erro: {postErrorMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmitPost(onSubmitPost)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Título da Publicação *</label>
                <input {...registerPost('title', { required: 'O título é obrigatório' })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  placeholder="Ex: Relato de Experiência na USF..." />
                {postErrors.title && <span className="text-red-500 text-sm mt-1">{postErrors.title.message}</span>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Resumo Curto *</label>
                <textarea {...registerPost('summary', { required: 'O resumo é obrigatório' })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none h-20 resize-none"
                  placeholder="Um texto de 2 a 3 linhas para aparecer na página inicial." />
                {postErrors.summary && <span className="text-red-500 text-sm mt-1">{postErrors.summary.message}</span>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Conteúdo *</label>
                  <select {...registerPost('tipo_conteudo', { required: 'Selecione um tipo' })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 bg-white">
                    <option value="">Selecione...</option>
                    <option value="Relato de Experiência">Relato de Experiência</option>
                    <option value="Educação em Saúde">Educação em Saúde</option>
                    <option value="Pesquisa e Evidência">Pesquisa e Evidência</option>
                    <option value="Integração Inter-GT">Integração Inter-GT</option>
                  </select>
                  {postErrors.tipo_conteudo && <span className="text-red-500 text-sm mt-1">{postErrors.tipo_conteudo.message}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Grupo (Origem) *</label>
                  <select {...registerPost('gt_origem', { required: 'Selecione um GT' })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 bg-white">
                    <option value="">Selecione...</option>
                    <option value="GT 01">GT 01</option>
                    <option value="GT 08">GT 08</option>
                    <option value="GT 12">GT 12</option>
                    <option value="Diversos">Diversos / Inter-GT</option>
                  </select>
                  {postErrors.gt_origem && <span className="text-red-500 text-sm mt-1">{postErrors.gt_origem.message}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Data *</label>
                  <input type="date" {...registerPost('data', { required: 'Data obrigatória' })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none" />
                  {postErrors.data && <span className="text-red-500 text-sm mt-1">{postErrors.data.message}</span>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Território (Local da Ação)</label>
                <input {...registerPost('territorio')}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  placeholder="Ex: USF Alto do Céu, Cabedelo..." />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Conteúdo Completo</label>
                <textarea {...registerPost('content')}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:outline-none h-48"
                  placeholder="Escreva ou cole o texto completo aqui." />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button type="submit" disabled={isPostSubmitting}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                  {isPostSubmitting ? 'Salvando...' : <><Save className="w-5 h-5" /> Publicar Material</>}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
