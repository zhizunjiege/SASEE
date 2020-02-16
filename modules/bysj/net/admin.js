export default [{
    method: 'post',
    path: '/data',
    async callback(data) {
        console.log(data);
        let response = await this.$post('/data', data);
        console.log(response);
        return 112;
    }
}]