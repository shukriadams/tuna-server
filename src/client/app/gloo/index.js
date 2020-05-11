import yarn from 'yarn';

/*
    Returns version from packageJson.
    JSPMdependency : optional - JSPM dependency in package.json to look for, if not given return own version
*/
function getVersion(packageJson, JSPMdependency){
    let version = '';

    if (JSPMdependency){
        if (packageJson.jspm && packageJson.jspm.dependencies){
            //WARN : assumes @ is always used for tags
            let dependencyAlias = packageJson.jspm.dependencies[JSPMdependency];
            if (dependencyAlias){
                version = yarn.returnAfter(dependencyAlias, '@');
            }
        }
    } else
        version = packageJson.version;

    return yarn.replaceAll(version, '.', '-');
}

export {
    getVersion
}