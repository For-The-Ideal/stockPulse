<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="modelValue" class="modal-overlay" @click="handleOverlayClick">
        <div class="modal-container" @click.stop>
          <!-- 关闭按钮 -->
          <button class="modal-close" @click="closeModal">
            <i class="fas fa-times"></i>
          </button>

          <!-- 左侧品牌区 -->
          <div class="modal-brand">
            <div class="brand-icon">
              <i class="fas fa-chart-line"></i>
            </div>
            <h2 class="brand-title">StockPulse</h2>
            <p class="brand-slogan">您的智能投资助手</p>
            <div class="brand-features">
              <div class="feature-item">
                <i class="fas fa-check-circle"></i>
                <span>实时行情</span>
              </div>
              <div class="feature-item">
                <i class="fas fa-check-circle"></i>
                <span>多源资讯</span>
              </div>
              <div class="feature-item">
                <i class="fas fa-check-circle"></i>
                <span>智能投研</span>
              </div>
            </div>
          </div>

          <!-- 右侧登录表单区 -->
          <div class="modal-form">
            <!-- 标题和切换标签 -->
            <div class="form-header">
              <h3>欢迎回来</h3>
              <div class="tab-switch">
                <button 
                  class="tab-btn" 
                  :class="{ active: activeTab === 'password' }"
                  @click="activeTab = 'password'"
                >
                  密码登录
                </button>
                <button 
                  class="tab-btn" 
                  :class="{ active: activeTab === 'sms' }"
                  @click="activeTab = 'sms'"
                >
                  短信登录
                </button>
              </div>
            </div>

            <!-- 密码登录表单 -->
            <form v-if="activeTab === 'password'" @submit.prevent="handlePasswordLogin">
              <div class="form-group">
                <div class="input-icon">
                  <i class="fas fa-user"></i>
                </div>
                <input 
                  type="text" 
                  v-model="passwordForm.username"
                  placeholder="手机号/邮箱/用户名"
                  class="form-input"
                  :class="{ error: passwordErrors.username }"
                  @blur="validatePasswordField('username')"
                />
                <span v-if="passwordErrors.username" class="error-text">{{ passwordErrors.username }}</span>
              </div>

              <div class="form-group">
                <div class="input-icon">
                  <i class="fas fa-lock"></i>
                </div>
                <input 
                  :type="showPassword ? 'text' : 'password'"
                  v-model="passwordForm.password"
                  placeholder="密码"
                  class="form-input"
                  :class="{ error: passwordErrors.password }"
                  @blur="validatePasswordField('password')"
                />
                <button 
                  type="button" 
                  class="password-toggle"
                  @click="showPassword = !showPassword"
                >
                  <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
                <span v-if="passwordErrors.password" class="error-text">{{ passwordErrors.password }}</span>
              </div>

              <div class="form-options">
                <a href="#" class="forgot-link" @click.prevent="handleForgotPassword">忘记密码？</a>
              </div>

              <button type="submit" class="submit-btn" :disabled="passwordLoading">
                <span v-if="passwordLoading" class="loading-spinner"></span>
                {{ passwordLoading ? '登录中...' : '登录' }}
              </button>
            </form>

            <!-- 短信登录表单 -->
            <form v-else @submit.prevent="handleSmsLogin">
              <div class="form-group">
                <div class="input-icon">
                  <i class="fas fa-mobile-alt"></i>
                </div>
                <input 
                  type="tel" 
                  v-model="smsForm.phone"
                  placeholder="手机号码"
                  class="form-input"
                  :class="{ error: smsErrors.phone }"
                  @blur="validateSmsField('phone')"
                />
                <span v-if="smsErrors.phone" class="error-text">{{ smsErrors.phone }}</span>
              </div>

              <div class="form-group form-group-with-code">
                <div class="input-icon">
                  <i class="fas fa-key"></i>
                </div>
                <input 
                  type="text" 
                  v-model="smsForm.code"
                  placeholder="验证码"
                  class="form-input code-input"
                  :class="{ error: smsErrors.code }"
                  @blur="validateSmsField('code')"
                />
                <button 
                  type="button" 
                  class="code-btn" 
                  :disabled="codeSending || codeCountdown > 0"
                  @click="sendCode"
                >
                  {{ codeCountdown > 0 ? `${codeCountdown}s后重发` : '获取验证码' }}
                </button>
                <span v-if="smsErrors.code" class="error-text">{{ smsErrors.code }}</span>
              </div>

              <button type="submit" class="submit-btn" :disabled="smsLoading">
                <span v-if="smsLoading" class="loading-spinner"></span>
                {{ smsLoading ? '登录中...' : '登录' }}
              </button>
            </form>

            <!-- 社交登录 -->
            <div class="social-login">
              <p class="social-text">其他登录方式</p>
              <div class="social-icons">
                <button class="social-icon wechat" @click="socialLogin('wechat')">
                  <i class="fab fa-weixin"></i>
                </button>
                <button class="social-icon qq" @click="socialLogin('qq')">
                  <i class="fab fa-qq"></i>
                </button>
                <button class="social-icon weibo" @click="socialLogin('weibo')">
                  <i class="fab fa-weibo"></i>
                </button>
              </div>
            </div>

            <!-- 注册引导 -->
            <div class="register-guide">
              还没有账号？
              <a href="#" @click.prevent="handleRegister">立即注册</a>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useLoginStore } from '~/stores/login.js';
const loginStore = useLoginStore();
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update-modelValue', 'login-success']);

const activeTab = ref('password'); // password / sms

// 密码登录表单
const passwordForm = ref({
  username: '123456',
  password: '123456',
  remember: false
});

const passwordErrors = ref({
  username: '',
  password: ''
});

const passwordLoading = ref(false);
const showPassword = ref(false);

// 短信登录表单
const smsForm = ref({
  phone: '',
  code: ''
});

const smsErrors = ref({
  phone: '',
  code: ''
});

const smsLoading = ref(false);
const codeSending = ref(false);
const codeCountdown = ref(0);
let countdownTimer = null;

// ========== 验证函数 ==========
const validatePasswordField = (field) => {
  if (field === 'username') {
    if (!passwordForm.value.username) {
      passwordErrors.value.username = '请输入账号';
    } else if (passwordForm.value.username.length < 3) {
      passwordErrors.value.username = '账号长度不能小于3位';
    } else {
      passwordErrors.value.username = '';
    }
  } else if (field === 'password') {
    if (!passwordForm.value.password) {
      passwordErrors.value.password = '请输入密码';
    } else if (passwordForm.value.password.length < 6) {
      passwordErrors.value.password = '密码长度不能小于6位';
    } else {
      passwordErrors.value.password = '';
    }
  }
};

const validatePasswordForm = () => {
  validatePasswordField('username');
  validatePasswordField('password');
  return !passwordErrors.value.username && !passwordErrors.value.password;
};

const validateSmsField = (field) => {
  if (field === 'phone') {
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!smsForm.value.phone) {
      smsErrors.value.phone = '请输入手机号';
    } else if (!phoneRegex.test(smsForm.value.phone)) {
      smsErrors.value.phone = '请输入正确的手机号';
    } else {
      smsErrors.value.phone = '';
    }
  } else if (field === 'code') {
    if (!smsForm.value.code) {
      smsErrors.value.code = '请输入验证码';
    } else if (!/^\d{6}$/.test(smsForm.value.code)) {
      smsErrors.value.code = '验证码为6位数字';
    } else {
      smsErrors.value.code = '';
    }
  }
};

const validateSmsForm = () => {
  validateSmsField('phone');
  validateSmsField('code');
  return !smsErrors.value.phone && !smsErrors.value.code;
};

const closeModal = () => {
  emit('update-modelValue', false);
  passwordForm.value = { username: '', password: '', remember: false };
  smsForm.value = { phone: '', code: '' };
  passwordErrors.value = { username: '', password: '' };
  smsErrors.value = { phone: '', code: '' };
  showPassword.value = false;
  activeTab.value = 'password';
  if (countdownTimer) {
    clearInterval(countdownTimer);
    codeCountdown.value = 0;
  }
};

const handleOverlayClick = (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    closeModal();
  }
};

// 密码登录
const handlePasswordLogin = async () => {
  if (!validatePasswordForm()) return;
  
  passwordLoading.value = true;
  try {
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // 登录成功
    emit('login-success', { type: 'password', ...passwordForm.value });
    // 登录成功后，更新登录状态
    loginStore.setLoginInfo();
    closeModal();
  } catch (error) {
    passwordLoading.value = false;
    // 这里可以显示错误提示
  } finally {
    passwordLoading.value = false;
  }
};

// 发送验证码
const sendCode = async () => {
  validateSmsField('phone');
  if (smsErrors.value.phone) return;
  
  codeSending.value = true;
  try {
    // 模拟发送验证码
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 开始倒计时
    codeCountdown.value = 60;
    countdownTimer = setInterval(() => {
      codeCountdown.value--;
      if (codeCountdown.value <= 0) {
        clearInterval(countdownTimer);
        codeCountdown.value = 0;
      }
    }, 1000);
    
    console.log('验证码已发送');
  } catch (error) {
    console.error('发送失败', error);
  } finally {
    codeSending.value = false;
  }
};

// 短信登录
const handleSmsLogin = async () => {
  if (!validateSmsForm()) return;
  
  smsLoading.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    emit('login-success', { type: 'sms', ...smsForm.value });
    // 登录成功后，更新登录状态
    loginStore.setLoginInfo();
    closeModal();
  } catch (error) {
    smsLoading.value = false;
  } finally {
    smsLoading.value = false;
  }
};

// 社交登录
const socialLogin = (type) => {
  console.log(`社交登录: ${type}`);
  // 这里可以处理社交登录逻辑
};

const handleForgotPassword = () => {
  console.log('忘记密码');
  // 跳转到找回密码页面
};

const handleRegister = () => {
  console.log('注册账号');
  closeModal();
  // 跳转到注册页
};

// ========== 清理 ==========
watch(() => props.modelValue, (newVal) => {
  if (!newVal && countdownTimer) {
    clearInterval(countdownTimer);
    codeCountdown.value = 0;
  }
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  cursor: pointer;
}

.modal-container {
  width: 900px;
  max-width: 90vw;
  background: #11161f;
  border-radius: 32px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(75, 130, 200, 0.15) inset;
  display: flex;
  overflow: hidden;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #1f2c3f;
  border: 1px solid #364e72;
  color: #9bb5e0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  z-index: 10;
}

.modal-close:hover {
  background: #2f4567;
  color: white;
  transform: rotate(90deg);
}

/* 左侧品牌区 */
.modal-brand {
  width: 40%;
  background: linear-gradient(145deg, #0f1a2a, #1a2740);
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border-right: 1px solid #273349;
}

.brand-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(145deg, #3b7cff, #1f4fbc);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  box-shadow: 0 15px 30px -8px #0e2b5e;
}

.brand-icon i {
  font-size: 3rem;
  color: white;
}

.brand-title {
  color: white;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #ffffff, #b0c7f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.brand-slogan {
  color: #8aa3cc;
  font-size: 1rem;
  margin-bottom: 2.5rem;
}

.brand-features {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: #b8d1f5;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 40px;
  border: 1px solid rgba(75, 130, 200, 0.2);
}

.feature-item i {
  color: #3e7aff;
  font-size: 1.1rem;
}

/* 右侧表单区 */
.modal-form {
  width: 60%;
  padding: 2.5rem;
}

.form-header {
  margin-bottom: 2rem;
}

.form-header h3 {
  color: white;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.tab-switch {
  display: flex;
  gap: 1rem;
  background: #1b232f;
  padding: 0.3rem;
  border-radius: 40px;
  border: 1px solid #2d384a;
}

.tab-btn {
  flex: 1;
  padding: 0.6rem 1rem;
  border-radius: 30px;
  font-weight: 500;
  font-size: 0.9rem;
  color: #99aec9;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn.active {
  background: #2b3b52;
  color: white;
  box-shadow: 0 4px 8px #0d1a2b;
}

/* 表单样式 */
.form-group {
  margin-bottom: 1.5rem;
  position: relative;
}

.input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b85ad;
  z-index: 1;
}

.form-input {
  width: 100%;
  padding: 0.9rem 1rem 0.9rem 2.8rem;
  background: #0e1622;
  border: 1px solid #2c3f5c;
  border-radius: 40px;
  color: #ecf5ff;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #3e7aff;
  box-shadow: 0 0 0 3px rgba(62, 122, 255, 0.1);
}

.form-input.error {
  border-color: #ea5b5b;
}

.error-text {
  position: absolute;
  left: 1rem;
  bottom: -1.2rem;
  color: #ea5b5b;
  font-size: 0.7rem;
}

.password-toggle {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: #6b85ad;
  cursor: pointer;
  z-index: 1;
}

.password-toggle:hover {
  color: #8aa9ff;
}

/* 验证码行 */
.form-group-withCode {
  display: flex;
  gap: 0.8rem;
  align-items: center;
}

.code-input {
  width: calc(100% - 110px);
}

.code-btn {
  width: 100px;
  height: 46px;
  background: #1f2c3f;
  border: 1px solid #2f4567;
  border-radius: 40px;
  color: #b8d6ff;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.code-btn:hover:not(:disabled) {
  background: #2f4567;
  color: white;
  border-color: #5f8ad4;
}

.code-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 表单选项 */
.form-options {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 1rem 0 2rem;
}

.remember-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #99aec9;
  cursor: pointer;
}

.remember-checkbox input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: #3e7aff;
}

.forgot-link {
  color: #6b9eff;
  text-decoration: none;
  font-size: 0.9rem;
}

.forgot-link:hover {
  text-decoration: underline;
}

/* 提交按钮 */
.submit-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(145deg, #3b7cff, #1f4fbc);
  border: none;
  border-radius: 40px;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 8px 16px -4px #0e2b5e;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px -6px #0e2b5e;
  background: linear-gradient(145deg, #4b8aff, #2f5fcc);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 社交登录 */
.social-login {
  margin: 2rem 0 1.5rem;
  text-align: center;
}

.social-text {
  color: #687e9f;
  font-size: 0.85rem;
  margin-bottom: 1rem;
  position: relative;
}

.social-text::before,
.social-text::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 30%;
  height: 1px;
  background: #25344a;
}

.social-text::before {
  left: 0;
}

.social-text::after {
  right: 0;
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.social-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid #364e72;
  background: #1f2c3f;
  color: #9bb5e0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1.2rem;
}

.social-icon:hover {
  transform: translateY(-3px);
}

.social-icon.wechat:hover {
  background: #2bae5c;
  border-color: #2bae5c;
  color: white;
}

.social-icon.qq:hover {
  background: #12b7f5;
  border-color: #12b7f5;
  color: white;
}

.social-icon.weibo:hover {
  background: #e6162d;
  border-color: #e6162d;
  color: white;
}

/* 注册引导 */
.register-guide {
  text-align: center;
  color: #687e9f;
  font-size: 0.9rem;
}

.register-guide a {
  color: #6b9eff;
  text-decoration: none;
  font-weight: 500;
  margin-left: 0.5rem;
}

.register-guide a:hover {
  text-decoration: underline;
}

/* 过渡动画 */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-container,
.modal-fade-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-fade-enter-from .modal-container,
.modal-fade-leave-to .modal-container {
  transform: scale(0.95);
}

/* 响应式 */
@media (max-width: 768px) {
  .modal-container {
    flex-direction: column;
    max-height: 90vh;
    overflow-y: auto;
  }
  
  .modal-brand {
    width: 100%;
    padding: 2rem;
  }
  
  .modal-form {
    width: 100%;
    padding: 2rem;
  }
  
  .brand-features {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .feature-item {
    width: calc(50% - 0.5rem);
  }
}
</style>