import { useState, useEffect } from 'react'
import {
  fetchAcceptedStudents,
  getCourseEvaluations,
} from '../../services/teacherService'
import RoleLayout from '../../components/RoleLayout'

const Grading = () => {
  const [courseEvaluation, setCourseEvaluation] = useState({
    totals: Array(6).fill(0),
    weights: Array(6).fill(0),
  })
  const [isEvaluationSet, setIsEvaluationSet] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [students, setStudents] = useState([])
  const [marks, setMarks] = useState({})

  useEffect(() => {
    const fetchCourseEvaluation = async () => {
      setIsLoading(true)
      try {
        const data = await getCourseEvaluations()
        if (data) {
          if(data.isComplete){
            setCourseEvaluation({
                totals:data.totals,
                weights:data.weights,
            })
            setIsEvaluationSet(true);
          }else{
            setIsEvaluationSet(false);
          }
        }
      } catch (error) {
        console.error('Failed to fetch course evaluation:', error)
      } finally {
        setIsLoading(false)
      }
    }

    const fetchStudents = async () => {
      try {
        const data = await fetchAcceptedStudents()
        setStudents(data)
      } catch (error) {
        console.error('Failed to fetch students:', error)
      }
    }

    fetchCourseEvaluation()
    fetchStudents()
  }, [])

  const handleEvaluationInputChange = (e, type, index) => {
    const newValues = { ...courseEvaluation }
    newValues[type][index] = e.target.value
    setCourseEvaluation(newValues)
  }

  const handleEvaluationSubmit = async () => {
    // Check if all totals and weights are filled
    const allTotalsFilled = courseEvaluation.totals.every(
      (total) => total !== ''
    )
    const allWeightsFilled = courseEvaluation.weights.every(
      (weight) => weight !== ''
    )

    if (!allTotalsFilled || !allWeightsFilled) {
      alert('Please fill all totals and weights fields.')
      return
    }

    try {
      await teacherservice.setCourseEvaluation(
        courseId,
        courseEvaluation.totals,
        courseEvaluation.weights
      )
      setIsEvaluationSet(true)
    } catch (error) {
      console.error('Failed to set course evaluation:', error)
    }
  }

  const handleMarksChange = (e, studentId) => {
    const newMarks = { ...marks }
    newMarks[studentId] = e.target.value
    setMarks(newMarks)
  }

  const handleUpdateMarks = async (studentId) => {
    if (!marks[studentId]) return // If no marks, don't update

    // try {
    //   await teacherservice.updateStudentMarks(
    //     courseId,
    //     studentId,
    //     marks[studentId]
    //   )
    //   alert('Marks updated successfully')
    // } catch (error) {
    //   console.error('Failed to update marks:', error)
    // }
  }

  return (
    <RoleLayout>
      <div>
        <h1>Course Evaluation & Student Marks</h1>

        {/* Course Evaluation Section */}
        <div>
          <h3>Course Evaluation</h3>

          {isLoading && <p>Loading...</p>}

          <div>
            <div>
              <h4>Totals</h4>
              {courseEvaluation.totals.map((total, index) => (
                  <input
                  key={`total-${index}`}
                  type='number'
                  value={total}
                  onChange={(e) =>
                    handleEvaluationInputChange(e, 'totals', index)
                }
                disabled={isLoading}
                />
            ))}
            </div>
            <div>
              <h4>Weights</h4>
              {courseEvaluation.weights.map((weight, index) => (
                  <input
                  key={`weight-${index}`}
                  type='number'
                  value={weight}
                  onChange={(e) =>
                    handleEvaluationInputChange(e, 'weights', index)
                }
                disabled={isLoading}
                />
            ))}
            </div>
          </div>

            {!isEvaluationSet && !isLoading && (
              <div>
                <button onClick={handleEvaluationSubmit}>
                  Set Course Evaluation
                </button>
              </div>
            )}
            
        </div>

        {/* Student Marks Section */}
        <div>
          <h3>Fill Student Marks</h3>
          {!isEvaluationSet ? (
            <p>
              Please complete the course evaluation before filling student
              marks.
            </p>
          ) : (
            <div>
              {students.map((student) => (
                <div key={student.id}>
                  <span>{student.name}</span>
                  <input
                    type='number'
                    value={marks[student.id] || ''}
                    onChange={(e) => handleMarksChange(e, student.id)}
                  />
                  <button onClick={() => handleUpdateMarks(student.id)}>
                    Update
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </RoleLayout>
  )
}

export default Grading
