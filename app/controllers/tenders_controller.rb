class TendersController < ApplicationController
  def index
    @user = User.find_by_id params[:user_id]
    @current_user = User.find_by_id(session[:user_id])
    if !@user
      error = "You misspelled the path"
      flash.alert = "You misspelled the path"
    else
       @tenders=Tender.where user_id:@user.id
       tenders_to_json = []
       @tenders.each do |tender|
          tender_hash = {tender:tender,job:tender.job}

          if tender.accepted && (tender.user_id == @current_user.id)
            tender_hash[:email] = tender.job.user.email
            tender_hash[:phone] = tender.job.user.phone_number
          end
          tenders_to_json << tender_hash
       end
    end
    render json: tenders_to_json
  end

  def create
    job=Job.find(params[:job_id])
    user=User.find_by_id(session[:user_id])
    if user&&job
      if user.profession != 'customer'
        if !job.tenders.find_by_user_id(user.id)
          Tender.create(job:job,user:user)
           puts 'tender create'
          render json: {notice:'You successfully applied for a job'}
        else
          render json: {alert:"You already applied for this job"}, status: :forbidden
        end
      else
        render json: {alert:'You need to be registered as a tradie to apply'}, status: :forbidden
      end
    else
      render json: {alert: "You should be logged in to register interest in a job"} , status: :unauthorized
    end
    # params[:job_id]
  end

  def update
    tender = Tender.find(params[:id])
    if params[:tender]
      # render text: "this is what you're looking for: #{params[:tender][:comment]}"
      if params[:accepted] == true
        tenders = tender.job.tenders.where( accepted: true)
        p tenders
        tenders.each do |job_tender|
          job_tender.update(accepted:false)
        end

        tender.update(accepted: true)
      end
      tender.update(comment: params[:tender][:comment])
      render json: {notice: "comment posted"}
    else
      job_tenders = Tender.where(job_id: tender.job_id)
      job_tenders.each { |job| job.update(accepted: false)}
      
      render json: {notice: "tender accepted"}
    end
  end

end
