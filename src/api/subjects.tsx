import axios from 'axios'
const base_url = import.meta.env.VITE_BASE_URL;

// export const getSubjects = async (): Promise<{ data: Subject[] }> => {

export const getSubjects = async () => {
 
    const access_token = localStorage.getItem('access_token')

    try {
        const response = await axios.get(`${base_url}/subjects`, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
        return response
    }
    catch (error) {
        return error
    }
}

export const fetchSubjects = async (userId: number) => {
    const access_token = localStorage.getItem('access_token');

    try {
        const response = await axios.get(`${base_url}/api/schedule/user/${userId}`, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        });
        return response;
    } catch (error) {
        return error;
    }
};


export const enrollToSubject = async (userId: number, subjectId: number) => {
    const access_token = localStorage.getItem('access_token');

    try {
        const response = await axios.post(`${base_url}/api/schedule/enroll`, {
            userId,
            subjectId
        }, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        });
        return response;
    } catch (error) {
        return error;
    }
};
