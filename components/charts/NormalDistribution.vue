<!-- NormalDistributionChart.vue -->
<template>
    <div >
        <Line :width="300" :height="300" :data="chartData" :options="chartOptions" v-if="chartData"/>
    </div>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue'
import { Chart, elements, registerables } from 'chart.js'
import { Line } from 'vue-chartjs'
Chart.register(...registerables)

const props = defineProps<{
  mean: number;
  stddev: number;
}>()


const chartData = ref()

onMounted( async () => {
  const { xValues, yValues } = generateNormalDistributionData(props.mean, props.stddev)
  setChartData(xValues, yValues)
});

watch(() => props.mean, (newValue) => {
  const { xValues, yValues } = generateNormalDistributionData(newValue, props.stddev)
  setChartData(xValues, yValues)
});

watch(() => props.stddev, (newValue) => {
  const { xValues, yValues } = generateNormalDistributionData(props.mean, newValue)
  setChartData(xValues, yValues)
});


const setChartData = (xValues : number[],yValues : number[]) => {
  chartData.value = {
    labels: xValues,
    datasets: [
      {
        label: 'Distribution Normale des loyers au m2',
        data: yValues,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true
      }
    ]
  }
}

const generateNormalDistributionData = (mean, stdDev, numPoints = 1000) => {
  const xValues = []
  const yValues = []
  const minX = mean - 3 * stdDev // Adjust the range as needed
  const maxX = mean + 3 * stdDev // Adjust the range as needed
  const step = (maxX - minX) / numPoints

  for (let i = 0; i <= numPoints; i++) {
    const x = parseFloat((minX + i * step).toFixed(2))
    const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2))
    if(x > 0) {
      xValues.push(x)
      yValues.push(y)
    }
  }

  return { xValues, yValues }
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      title: {
        display: true,
        text: 'Loyer / m²'
      },
      ticks: {
        begin: 0
      }
    },
    y: {
      title: {
        display: true,
        text: 'Densité de Probabilité'
      },
    }
  },
  plugins: {
    legend: {
      display: false
    },
    title: {
      display: true,
      text: 'Distribution normale des loyers au m²'
    }
  },
  elements: {
    point: {
      radius: 0
    }
  }
}
</script>