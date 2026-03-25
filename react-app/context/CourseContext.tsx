import {createContext, ReactNode, useContext, useState} from "react";
import React from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

interface CourseContextProps{
    courses: Course[],
    addCourse: (course: Course) => void,
    updateCourse: (id: number, course: Course) => void
    calculateDistance: (id: number) => number,
    getCourseById: (id: number) => Course,
}

const CourseContext = createContext<CourseContextProps | undefined>(undefined);

export function CourseContextProvider({children}:{children: ReactNode}){
    const [courses, setCourses ] = useState<Course[]>([]);



    const addCourse = (course: Course) => {
        setCourses(prevList => [...prevList, course]);
    }

    const updateCourse = (id: number, updatedCourse: Course) => {
        setCourses(prevList => {
            prevList.map((course: Course) => course.id === id ? updatedCourse : course)
            return prevList;
        })
    }

    const getCourseById = (id: number) => {
        return courses.find(course => course.id === id)!;
    }

    const calculateDistance= (id: number) => {
        const course = getCourseById(id);
        return Math.hypot(course.ball.xCoord, course.ball.yCoord, course.target.xCoord, course.target.yCoord);
    }

    return (
        <CourseContext.Provider value={{courses, addCourse, updateCourse, calculateDistance, getCourseById}}>
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

