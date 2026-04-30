export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true'

function getApexEnv() {
  if (window.apex?.env) {
    return window.apex.env
  }
  const pFlowId = document.getElementById('pFlowId')
  const pFlowStepId = document.getElementById('pFlowStepId')
  const pInstance = document.getElementById('pInstance')
  if (pFlowId && pFlowStepId && pInstance) {
    return {
      APP_ID: pFlowId.value,
      APP_PAGE_ID: pFlowStepId.value,
      APP_SESSION: pInstance.value,
      APP_USER: null,
    }
  }
  return { APP_ID: null, APP_PAGE_ID: null, APP_SESSION: null, APP_USER: null }
}

export async function callProcess(processName, extras = {}) {
  const env = getApexEnv()
  const params = new URLSearchParams({
    p_request: `APPLICATION_PROCESS=${processName}`,
    p_flow_id: env.APP_ID ?? '',
    p_flow_step_id: env.APP_PAGE_ID ?? '',
    p_instance: env.APP_SESSION ?? '',
    ...extras,
  })
  const response = await fetch('/apex/wwv_flow.ajax', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
    credentials: 'include',
  })
  const text = await response.text()
  return JSON.parse(text)
}

export { getApexEnv }