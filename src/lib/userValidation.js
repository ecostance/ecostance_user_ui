import { me } from "src/apiClient/auth"

export const getUserInfo = async () => {
    try {
        const response = await me()
        return response
    } catch (error) {
        console.log('error');
    }
}