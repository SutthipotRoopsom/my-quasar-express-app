<template>
  <q-page padding>
    <div class="text-h4 q-mb-md">
      Advanced Full-Stack Demo (Quasar + Express)
    </div>

    <!-- แสดงข้อมูลนักศึกษาจาก Backend -->
    <q-card class="q-mb-md bg-primary text-white">
      <q-card-section>
        <div class="text-h6">ข้อมูลนักศึกษา (จาก Backend API)</div>
        <div v-if="loading" class="q-mt-sm">
          <q-spinner color="white" size="2em" />
          <span class="q-ml-sm">กำลังโหลดข้อมูล...</span>
        </div>
        <div v-else-if="apiData.student" class="q-mt-sm">
          <div class="text-h6">{{ apiData.student.fullName }}</div>
          <div class="text-subtitle1">รหัสนักศึกษา: {{ apiData.student.studentId }}</div>
        </div>
        <div v-else class="q-mt-sm">
          <div class="text-subtitle1">ชื่อ: นาย สุทธิพจน์ รูปโสม</div>
          <div class="text-subtitle1">รหัส: 6604101391</div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Debug Info -->
    <q-banner v-if="debugInfo" class="bg-info text-white q-mb-md">
      <template v-slot:avatar>
        <q-icon name="bug_report" />
      </template>
      <div class="text-caption">
        <div><strong>API URL:</strong> {{ debugInfo.apiUrl }}</div>
        <div><strong>Environment:</strong> {{ debugInfo.env }}</div>
        <div v-if="error" class="text-negative"><strong>Error:</strong> {{ error }}</div>
      </div>
    </q-banner>

    <!-- Git Workflow -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">Git Workflow</div>
        <q-list bordered separator class="q-mt-sm">
          <q-item v-for="(step, index) in gitSteps" :key="index">
            <q-item-section avatar>
              <q-badge>{{ index + 1 }}</q-badge>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ step.title }}</q-item-label>
              <q-item-label caption lines="3">{{ step.detail }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <!-- Docker Concepts -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">Docker Concepts</div>
        <q-list bordered separator class="q-mt-sm">
          <q-item v-for="(item, index) in dockerItems" :key="index">
            <q-item-section>
              <q-item-label>{{ item.title }}</q-item-label>
              <q-item-label caption lines="3">{{ item.detail }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <!-- Backend API -->
    <q-card>
      <q-card-section>
        <div class="text-h6">Data from Backend API</div>

        <q-spinner v-if="loading" color="primary" size="2em" />

        <div v-else-if="error" class="text-negative q-pa-md">
          <q-icon name="error" size="2em" />
          <div class="q-mt-sm">{{ error }}</div>
        </div>

        <q-list v-else bordered separator class="q-mt-sm">
          <q-item>
            <q-item-section>
              <q-item-label>{{ apiData.git?.title || 'Advanced Git' }}</q-item-label>
              <q-item-label caption lines="3">
                {{ apiData.git?.detail || 'No data from API' }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>{{ apiData.docker?.title || 'Advanced Docker' }}</q-item-label>
              <q-item-label caption lines="3">
                {{ apiData.docker?.detail || 'No data from API' }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>

        <q-btn color="primary" class="q-mt-md" @click="fetchData">
          Refresh Data
        </q-btn>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// Import Quasar components
import {
  QPage,
  QCard,
  QCardSection,
  QList,
  QItem,
  QItemSection,
  QItemLabel,
  QBadge,
  QBtn,
  QSpinner,
  QBanner,
  QIcon
} from 'quasar'

const gitSteps = [
  {
    title: 'Advanced Git Workflow',
    detail: 'ใช้ branch protection บน GitHub, code review ใน PR, และ squash merge เพื่อ history สะอาด'
  }
]

const dockerItems = [
  {
    title: 'Advanced Docker',
    detail: 'ใช้ multi-stage build, healthcheck ใน Dockerfile, และ orchestration ด้วย Compose/Swarm'
  }
]

const apiData = ref({ student: null, git: {}, docker: {} })
const loading = ref(true)
const error = ref(null)
const debugInfo = ref(null)

const fetchData = async () => {
  loading.value = true
  error.value = null
  
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    const fullUrl = `${apiUrl}/api/demo`
    
    // Debug info
    debugInfo.value = {
      apiUrl: fullUrl,
      env: import.meta.env.MODE
    }
    
    console.log('🔍 Fetching from:', fullUrl)
    console.log('🔍 Environment:', import.meta.env.MODE)
    console.log('🔍 VITE_API_URL:', import.meta.env.VITE_API_URL)
    
    const response = await axios.get(fullUrl, {
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    console.log('✅ API response:', response.data)
    apiData.value = response.data
    
  } catch (err) {
    console.error('❌ Fetch error:', err)
    
    if (err.code === 'ECONNABORTED') {
      error.value = 'Request timeout - Backend ไม่ตอบสนอง'
    } else if (err.response) {
      error.value = `Server error: ${err.response.status} - ${err.response.statusText}`
    } else if (err.request) {
      error.value = 'ไม่สามารถเชื่อมต่อ Backend - ตรวจสอบว่า Backend ทำงานที่ port 3000 หรือไม่'
    } else {
      error.value = `Error: ${err.message}`
    }
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
</script>