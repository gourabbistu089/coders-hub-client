import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { addUser } from '../redux/features/userSlice'
import { BASE_URL } from '../utils/constant'
import {
  FaCloudUploadAlt,
  FaUpload,
  FaUserCircle,
} from "react-icons/fa";


const EditProfile = () => {
  const [profileImage, setProfileImage] = useState(null)

  const currentUser = useSelector((state) => state.user)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    age: '',
    gender: '',
    about: '',
    skills: []
  })
  const [currentSkill, setCurrentSkill] = useState('')
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [updateMessage, setUpdateMessage] = useState({ type: '', text: '' })
  const dispatch = useDispatch()

  const user = useSelector((state) => state.user)
  useEffect(()=>{
    const interval = setTimeout(() => {
      setUpdateMessage({ type: '', text: '' })
    }, 2000)

    return () => clearTimeout(interval)
  },[updateMessage])

  
  useEffect(() => {
    if (currentUser) {
      // Initialize form data with current user data
      setFormData({
        firstname: currentUser.firstname || '',
        lastname: currentUser.lastname || '',
        age: currentUser.age || '',
        gender: currentUser.gender || '',
        about: currentUser.about || '',
        skills: currentUser.skills || []
      })
    }
  }, [currentUser])
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    
    // Clear errors when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      })
    }
  }
  
  const handleAddSkill = () => {
    if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, currentSkill.trim()]
      })
      setCurrentSkill('')
    }
  }

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    })
  }
  
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.firstname.trim()) {
      newErrors.firstname = 'First name is required'
    } else if (formData.firstname.length < 4) {
      newErrors.firstname = 'First name must be at least 4 characters'
    }
    
    if (!formData.lastname.trim()) {
      newErrors.lastname = 'Last name is required'
    }
    
   
    
    if (formData.age && (isNaN(formData.age) || formData.age < 18)) {
      newErrors.age = 'Age must be a number and at least 18'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const [selectedFile, setSelectedFile] = useState(null);
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file); // Store the actual file
      setProfileImage(URL.createObjectURL(file)); // Keep the preview
    }
  };
  
  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (selectedFile) {  // Use selectedFile instead of profileImage
      try {
        const formData = new FormData();
        formData.append("image", selectedFile); // Append actual file
  
        // console.log(Object.fromEntries(formData.entries()));
  
        const res = await axios.post(`${BASE_URL}/profile/updatePhotoUrl`, formData, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" }
        });
  
        const { success, message, data } = res.data;
        if (success) {
          dispatch(addUser(data));
        } else {
          console.error(message);
        }
      } catch (error) {
        console.error("Image upload error:", error);
      }
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Uncomment when ready to implement submission
    if (!validateForm()) return
    
    setIsSubmitting(true)
    setUpdateMessage({ type: '', text: '' })
    
    try {
      
      const res =  await axios.patch(`${BASE_URL}/profile/edit`, formData, {
        withCredentials: true
      })
      console.log("res", res)
      const { success, message , data } = await res.data
      
      if (success) {
        setIsEditing(false)
        setUpdateMessage({ type: 'success', text: 'Profile updated successfully!' })
        dispatch(addUser(data))
      } else {
        setUpdateMessage({ type: 'error', text: message || 'Failed to update profile. Please try again.' })
      }
    } catch (error) {
      setUpdateMessage({ type: 'error', text: 'An unexpected error occurred. Please try again.' })
      console.error('Profile update error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center py-12 min-h-[80vh]">
        <span className="loading loading-spinner loading-xl text-secondary"></span>
      </div>
    )
  }
  
  return (
    <div className="py-8 bg-base-300 min-h-screen">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card bg-base-100 shadow-xl overflow-hidden"
        >
          <div className="card-body p-0">
            <div className="px-6 py-5 flex justify-between items-center border-b border-base-300">
              <h3 className="text-lg card-title">
                {isEditing ? 'Edit Profile' : 'Developer Profile'}
              </h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-secondary btn-sm"
                >
                  Edit Profile
                </button>
              )}
            </div>
            
            {updateMessage.text && (
              <div className={`p-4 ${updateMessage.type === 'success' ? 'bg-success/20' : 'bg-error/20'}`}>
                <div className="flex">
                  <div className="flex-shrink-0">
                    {updateMessage.type === 'success' ? (
                      <svg className="h-5 w-5 text-success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-error" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${updateMessage.type === 'success' ? 'text-success' : 'text-error'}`}>
                      {updateMessage.text}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {isEditing ? (
              <div className="px-6 py-5">
                   {/* Profile Image Update Section */}
        <section className="bg-richblack-800 p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-caribbeangreen-100 mb-6 flex items-center gap-3">
            <FaUserCircle /> Update Profile Picture
          </h2>
          <form onSubmit={handleImageUpload} className="space-y-4">
            <div className="flex flex-row items-center gap-6">
              {/* Current Profile Image */}
              <img
                src={profileImage || user?.photoUrl || "https://via.placeholder.com/150?text=Profile+Image"}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-caribbeangreen-300 object-cover shadow-lg transition-transform hover:scale-110"
              />

              {/* Select and Upload Buttons */}
              <div className="flex gap-4 flex-col">
                <label
                  htmlFor="imageUpload"
                  className="cursor-pointer px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold rounded-md hover:from-blue-600 hover:to-blue-800 transition flex items-center gap-2 shadow-md"
                >
                  Select Image
                </label>
                <input
                  type="file"
                  id="imageUpload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <button
                  type="submit"
                  className={`px-5 py-2 bg-gradient-to-r cursor-pointer flex items-center space-x-2  ${
                    profileImage ? "from-green-400 to-green-600" : "from-green-500 to-green-700"
                  } text-black font-bold rounded-md hover:from-green-500 hover:to-caribbeangreen-700 transition shadow-md`}
                  disabled={!profileImage}
                >
                  Update Picture
                </button>
              </div>
            </div>
          </form>
        </section>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label htmlFor="firstname" className="block text-sm font-medium opacity-70 mb-2">
                        First name
                      </label>
                      <input
                        type="text"
                        name="firstname"
                        id="firstname"
                        value={formData.firstname}
                        onChange={handleChange}
                        className={`input input-bordered w-full ${
                          errors.firstname ? 'input-error' : ''
                        }`}
                      />
                      {errors.firstname && (
                        <p className="mt-2 text-sm text-error">{errors.firstname}</p>
                      )}
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="lastname" className="block text-sm font-medium opacity-70 mb-2">
                        Last name
                      </label>
                      <input
                        type="text"
                        name="lastname"
                        id="lastname"
                        value={formData.lastname}
                        onChange={handleChange}
                        className={`input input-bordered w-full ${
                          errors.lastname ? 'input-error' : ''
                        }`}
                      />
                      {errors.lastname && (
                        <p className="mt-2 text-sm text-error">{errors.lastname}</p>
                      )}
                    </div>

                    
                    <div className="sm:col-span-3">
                      <label htmlFor="age" className="block text-sm font-medium opacity-70 mb-2">
                        Age
                      </label>
                      <input
                        type="number"
                        name="age"
                        id="age"
                        value={formData.age}
                        onChange={handleChange}
                        className={`input input-bordered w-full ${
                          errors.age ? 'input-error' : ''
                        }`}
                      />
                      {errors.age && (
                        <p className="mt-2 text-sm text-error">{errors.age}</p>
                      )}
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="gender" className="block text-sm font-medium opacity-70 mb-2">
                        Gender
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="select select-bordered w-full"
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="about" className="block text-sm font-medium opacity-70 mb-2">
                        About
                      </label>
                      <textarea
                        id="about"
                        name="about"
                        rows={3}
                        value={formData.about}
                        onChange={handleChange}
                        className="textarea textarea-bordered w-full"
                      />
                      <p className="mt-2 text-sm opacity-50">
                        Write a few sentences about yourself.
                      </p>
                    </div>

                    <div className="sm:col-span-6">
                      <label htmlFor="skills" className="block text-sm font-medium opacity-70 mb-2">
                        Skills
                      </label>
                      <div className="join w-full">
                        <input
                          type="text"
                          id="skills"
                          value={currentSkill}
                          onChange={(e) => setCurrentSkill(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                          className="input input-bordered join-item flex-1"
                          placeholder="Add skills (e.g. JavaScript, React)"
                        />
                        <button
                          type="button"
                          onClick={handleAddSkill}
                          className="btn btn-primary join-item"
                        >
                          Add
                        </button>
                      </div>
                      
                      {formData.skills.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {formData.skills.map((skill, index) => (
                            <div
                              key={index}
                              className="badge badge-primary gap-2"
                            >
                              {skill}
                              <button
                                type="button"
                                onClick={() => handleRemoveSkill(skill)}
                                className="btn btn-ghost btn-xs btn-circle"
                              >
                                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="btn btn-outline"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="loading loading-spinner loading-xs"></span>
                          Saving...
                        </>
                      ) : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div>
                <div className="collapse collapse-arrow bg-base-200 rounded-none">
                  <input type="checkbox" defaultChecked /> 
                  <div className="collapse-title text-sm font-medium opacity-80">
                    Profile Picture & Personal Info
                  </div>
                  <div className="collapse-content px-0">
                    <div className="flex flex-col sm:flex-row items-center px-6 py-4 gap-6">
                      <div className="avatar">
                        <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                          <img 
                            src={currentUser.photoUrl || "https://via.placeholder.com/150"} 
                            alt={`${currentUser.firstname} ${currentUser.lastname}`}
                          />
                        </div>
                      </div>
                      <div className="space-y-2 text-center sm:text-left">
                        <h2 className="text-2xl font-bold">{currentUser.firstname} {currentUser.lastname}</h2>
                        <p className="opacity-70">{currentUser.email}</p>
                        {currentUser.age && currentUser.gender && (
                          <p className="opacity-70 capitalize">{currentUser.age} years old • {currentUser.gender}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="collapse collapse-arrow bg-base-100 rounded-none">
                  <input type="checkbox" defaultChecked /> 
                  <div className="collapse-title text-sm font-medium opacity-80">
                    About
                  </div>
                  <div className="collapse-content">
                    <p className="px-2">
                      {currentUser.about || "No information provided."}
                    </p>
                  </div>
                </div>
                
                <div className="collapse collapse-arrow bg-base-200 rounded-none">
                  <input type="checkbox" defaultChecked /> 
                  <div className="collapse-title text-sm font-medium opacity-80">
                    Skills
                  </div>
                  <div className="collapse-content">
                    {currentUser.skills && currentUser.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2 px-2">
                        {currentUser.skills.map((skill, index) => (
                          <span 
                            key={index}
                            className="badge badge-primary badge-outline"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="px-2">No skills listed.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
    
  )
}

export default EditProfile


