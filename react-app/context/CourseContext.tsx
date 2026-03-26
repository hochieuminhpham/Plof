import {createContext, ReactNode, useContext, useEffect, useRef, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage"
import Course from "@/models/Course";

interface CourseContextProps{
    courses: Course[],
    addCourse: (course: Course) => void,
    updateCourse: (id: number, course: Course) => void
    calculateDistance: (id: number) => number,
    getCourseById: (id: number) => Course,
    image: string | undefined,
    setImage: (image: string) => void
}

const CourseContext = createContext<CourseContextProps | undefined>(undefined);

export function CourseContextProvider({children}:{children: ReactNode}){
    const [courses, setCourses ] = useState<Course[]>([]);
    const initialMount = useRef(true);
    const [image, setImage] = useState<string>();
    const [targetId, setTargetId] = useState<number>(0);
    const [ballId, setBallId] = useState<number>(0);

    useEffect(() => {
        generateCourse();
    }, []);

    useEffect(() => {
        if (initialMount.current){
            initialMount.current = false;
            return;
        }

        const saveCourse = async () => {
            try {
                await AsyncStorage.setItem("Courses", JSON.stringify(courses))
            } catch (e) {
                console.log(e)
            }
        }

        saveCourse();

    },[courses])

    const generateCourse = async () => {
        try {

            const target = {
                id: targetId + 1,
                xCoord: Math.floor(Math.random() * 5000),
                yCoord: Math.floor(Math.random() * 8000),
            };

            const ball = {
                id: ballId + 1,
                xCoord: Math.floor(Math.random() * 5000),
                yCoord: Math.floor(Math.random() * 8000),
            };

            const distance = Math.hypot(target.xCoord - ball.xCoord, target.yCoord - ball.yCoord);

            const newCourse: Course = {
                id: courses.length + 1,
                EndDistance: distance,
                isFinished: false,
                target: target,
                ball: ball,
                usedShots: 0,
                allowedShots: 10
            };

            addCourse(newCourse);
            setTargetId(prev => prev + 1);
            setBallId(prev => prev + 1);

            const coursesAsString = JSON.stringify(courses);
            await AsyncStorage.setItem("Courses", coursesAsString)
        } catch (error){
            console.log(error)
        }
    }


    const addCourse = (course: Course) => {
        setCourses(prevList => [...prevList, course]);
    }

    const updateCourse = (id: number, updatedCourse: Course) => {
        setCourses(prevList =>
            prevList.map((course: Course) => course.id === id ? updatedCourse : course)
        )
    }

    const getCourseById = (id: number) => {
        return courses.find(course => course.id === id)!;
    }

    const calculateDistance= (id: number) => {
        const course = getCourseById(id);
        return Math.hypot(course.ball.xCoord, course.ball.yCoord, course.target.xCoord, course.target.yCoord);
    }

    return (
        <CourseContext.Provider value={{courses, addCourse, updateCourse, calculateDistance, getCourseById, image, setImage}}>
            {children}
        </CourseContext.Provider>
    )
}

export function useCourse(){
    const context = useContext(CourseContext);

    if (!context){
        throw new Error("ERRRORRRR");
    }

    return context;
}

