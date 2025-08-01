import multer from 'multer'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'photoProfile') {
      cb(null, 'public/photoProfile')
    } else if (file.fieldname === 'cv') {
      cb(null, 'public/cv')
    } else {
      cb(new Error('Unexpected field'), '') // <== di sinilah error 500 kamu terjadi!
    }
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`
    cb(null, uniqueName)
  }
})

export const upload = multer({ storage })
