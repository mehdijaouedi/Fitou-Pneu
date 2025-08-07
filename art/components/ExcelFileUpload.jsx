import React, { useState, useRef } from 'react'
import { set, unset } from 'sanity'
import { Button, Card, Stack, Text, Box, Badge, Flex, Inline } from '@sanity/ui'
import * as XLSX from 'xlsx'

const ExcelFileUpload = React.forwardRef((props, ref) => {
  const { type, value, onChange } = props
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedData, setUploadedData] = useState(null)
  const [error, setError] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const fileInputRef = useRef(null)

  // Initialize uploadedData from value if it exists
  React.useEffect(() => {
    if (value && typeof value === 'string') {
      try {
        const parsedData = JSON.parse(value)
        setUploadedData(parsedData)
        setCurrentIndex(0)
      } catch (err) {
        console.log('Could not parse existing value')
      }
    }
  }, [value])

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setIsUploading(true)
    setError(null)

    try {
      // Parse the Excel data
      const data = await parseExcelFile(file)
      setUploadedData(data)
      setCurrentIndex(0)
      
      // Store the parsed data as JSON string
      onChange(set(JSON.stringify(data)))
      
    } catch (err) {
      setError(err.message)
    } finally {
      setIsUploading(false)
    }
  }

  const parseExcelFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result)
          const workbook = XLSX.read(data, { type: 'array' })
          
          // Get the first sheet
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          
          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
          
          if (jsonData.length === 0) {
            throw new Error('File appears to be empty')
          }

          // Check if first row contains headers
          const firstRow = jsonData[0] || []
          let headers = []
          let dataRows = jsonData

          // If first row has text content, use it as headers
          if (firstRow.some(cell => cell && cell.toString().trim() !== '')) {
            headers = firstRow.map(header => header ? header.toString().trim() : '')
            dataRows = jsonData.slice(1)
          } else {
            // If no headers, create generic column names
            const maxColumns = Math.max(...jsonData.map(row => row.length))
            headers = Array.from({ length: maxColumns }, (_, i) => `Column ${i + 1}`)
          }

          // Process all data rows, even empty ones
          const processedData = dataRows.map((row, rowIndex) => {
            const rowData = {}
            headers.forEach((header, i) => {
              // Use the value from the row, or empty string if not present
              rowData[header] = (row && row[i] !== undefined) ? row[i] : ''
            })
            return rowData
          })

          // Accept all rows, even if they appear empty
          // This allows for files with empty rows or partial data
          if (processedData.length === 0) {
            // If no data rows, create at least one empty row
            const emptyRow = {}
            headers.forEach(header => {
              emptyRow[header] = ''
            })
            processedData.push(emptyRow)
          }

          resolve(processedData)
        } catch (err) {
          reject(new Error('Failed to parse Excel file: ' + err.message))
        }
      }
      
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsArrayBuffer(file)
    })
  }

  const nextItem = () => {
    if (uploadedData && currentIndex < uploadedData.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const previousItem = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const clearData = () => {
    setUploadedData(null)
    setCurrentIndex(0)
    setError(null)
    onChange(unset())
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const currentItem = uploadedData ? uploadedData[currentIndex] : null

  return (
    <Stack space={4}>
      <Card padding={4} radius={2} shadow={1}>
        <Stack space={3}>
          <Text size={2} weight="semibold">
            Upload Excel File
          </Text>
          <Text size={1} muted>
            Upload your Excel file (.xlsx, .xls, .csv) to view all data one by one
          </Text>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
            id="excel-file-upload"
            disabled={isUploading}
          />
          
          <Button
            as="label"
            htmlFor="excel-file-upload"
            disabled={isUploading}
            tone="primary"
            text={isUploading ? 'Processing...' : 'Choose Excel File'}
          />
          
          {error && (
            <Card padding={3} radius={2} tone="critical">
              <Text size={1} tone="critical">
                Error: {error}
              </Text>
            </Card>
          )}
          
          {uploadedData && uploadedData.length > 0 && (
            <Card padding={3} radius={2} tone="positive">
              <Stack space={2}>
                <Text size={1} weight="semibold">
                  ✅ Successfully loaded {uploadedData.length} products
                </Text>
                <Text size={0} muted>
                  Use Previous/Next buttons to browse through all rows
                </Text>
                <Box>
                  <Button
                    onClick={clearData}
                    tone="critical"
                    text="Clear Data"
                    size={1}
                  />
                </Box>
              </Stack>
            </Card>
          )}
        </Stack>
      </Card>
      
      {currentItem && (
        <Card padding={4} radius={2} shadow={1}>
          <Stack space={4}>
            <Flex justify="space-between" align="center">
              <Text size={2} weight="semibold">
                Product {currentIndex + 1} of {uploadedData.length}
              </Text>
              <Inline space={2}>
                <Button
                  onClick={previousItem}
                  disabled={currentIndex === 0}
                  text="← Previous"
                  size={1}
                />
                <Button
                  onClick={nextItem}
                  disabled={currentIndex === uploadedData.length - 1}
                  text="Next →"
                  size={1}
                />
              </Inline>
            </Flex>
            
            <Card padding={3} radius={1} border>
              <Stack space={3}>
                <Flex justify="space-between" align="center">
                  <Text size={1} weight="semibold">
                    Product {currentIndex + 1}
                  </Text>
                  <Badge tone="primary">
                    Row {currentIndex + 1}
                  </Badge>
                </Flex>
                
                <Stack space={2}>
                  {Object.entries(currentItem).map(([key, value]) => (
                    <Flex key={key} justify="space-between">
                      <Text size={0} muted>{key}:</Text>
                      <Text size={0}>{value || '-'}</Text>
                    </Flex>
                  ))}
                </Stack>
              </Stack>
            </Card>
            
            <Flex justify="center">
              <Text size={0} muted>
                Use Previous/Next buttons to navigate through all {uploadedData.length} products
              </Text>
            </Flex>
          </Stack>
        </Card>
      )}
    </Stack>
  )
})

export default ExcelFileUpload 