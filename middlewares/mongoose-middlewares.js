// GroupSchema.pre('remove', function(next) {
//     var group = this;
//     group.model('Assignment').update(
//         { group: group._id }, 
//         { $unset: { group: 1 } }, 
//         { multi: true },
//         next);
// });

// ProjectSchema.pre('remove', function (next) {
//     var project = this;
//     project.model('Assignment').update(
//         { projects: project._id }, 
//         { $pull: { projects: project._id } }, 
//         { multi: true }, 
//         next);
// });