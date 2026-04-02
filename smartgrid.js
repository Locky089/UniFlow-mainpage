import smartgrid from 'smart-grid';

const settings = {
	outputStyle: 'sass',
    columns: 10,
    mobileFirst: true,
    offset: '20px',
    container: {
        maxWidth: '1200px',
        fields: '16px'
    },
    breakPoints: {
        l: {
            width: '1599px',
            fields: '100px'
        },
    	md: {
            width: '1199px',
            fields: '80px'
        },
        m: {
            width: '1024px',
            fields: '64px'
        },
        sm: {
            width: '600px',
            fields: '40px'
        },
        xs: {
            width: '576px',
            fields: '16px'
        },
        xxs: {
            width: '386px',
            fields: '16px'
        }
    },
    oldSizeStyle: false
};

smartgrid('./src/styles', settings);